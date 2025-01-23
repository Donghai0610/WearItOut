package com.g4.backend.service;

import com.g4.backend.dto.response.SettingIdNameResponseDTO;
import com.g4.backend.dto.response.ShopIdNameResponseDTO;
import com.g4.backend.dto.UserDetailDTO;
import com.g4.backend.dto.UserIdNameDTO;
import com.g4.backend.dto.request.NewUserRequestDTO;
import com.g4.backend.dto.request.UserRegisterRequestDTO;
import com.g4.backend.dto.response.UsersResponseDTO;
import com.g4.backend.mapper.UserMapper;
import com.g4.backend.model.Setting;
import com.g4.backend.model.Shop;
import com.g4.backend.model.User;
import com.g4.backend.repository.SettingRepository;
import com.g4.backend.repository.ShopRepositoryAdmin;
import com.g4.backend.repository.UserRepository;
import com.g4.backend.utils.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final SettingRepository settingRepository;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ShopRepositoryAdmin shopRepository;
    private final EmailServices emailServices;

    @Autowired
    public UserService(SettingRepository settingRepository, UserMapper userMapper, UserRepository userRepository, @Lazy BCryptPasswordEncoder passwordEncoder, ShopRepositoryAdmin shopRepository, EmailServices emailServices) {
        this.settingRepository = settingRepository;
        this.userMapper = userMapper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.shopRepository = shopRepository;
        this.emailServices = emailServices;
    }

    public Setting getDefaultSetting() {
        return settingRepository.findByName("USER");
    }

    public User saveUser(UserRegisterRequestDTO userRegisterRequestDTO) {
        if (userRepository.existsByUsername(userRegisterRequestDTO.getUsername())) {
            throw new IllegalArgumentException("Username has already existed");
        }
        userRegisterRequestDTO.setPassword(passwordEncoder.encode(userRegisterRequestDTO.getPassword()));
        User user = userMapper.userDTOToUser(userRegisterRequestDTO);

        user.setActive(true);

        Setting defaultSetting = settingRepository.findById(5)
                .orElseThrow(() -> new IllegalArgumentException("Setting with id 5 not found"));
        user.setSetting(defaultSetting);
        Thread thread = new Thread(() -> sendAccount(user.getUsername(), userRegisterRequestDTO .getPassword(), user.getEmail()));
        thread.start();
        return userRepository.save(user);
    }

    public Page<UsersResponseDTO> searchUsers(String keyword, String role, String isActive, String shop, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Boolean isActiveBool = (isActive != null) ? Boolean.parseBoolean(isActive) : null;
        Page<User> users = userRepository.searchByAllFields(keyword, role, isActiveBool, shop, pageable);
        return users.map(user -> {
            UsersResponseDTO responseDTO = userMapper.userToUserResponseDTO(user);
            responseDTO.setSettingName(user.getSetting().getName());
            responseDTO.setShopName(user.getShops().stream().map(Shop::getName).collect(Collectors.toList()));
            responseDTO.setIsActive(user.isActive() ? "true" : "false");
            return responseDTO;
        });
    }

    public User addNewUser(NewUserRequestDTO newUserRequestDTO) {
        if (userRepository.existsByUsername(newUserRequestDTO.getUsername())) {
            throw new IllegalArgumentException("Username has already existed");
        }
        if (userRepository.existsByEmail(newUserRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email has already existed");
        }
        String password = PasswordGenerator.generateRandomPassword();

        User user = userMapper.addnewUser(newUserRequestDTO);
        user.setPassword(passwordEncoder.encode(password));
        user.setActive(true);
        Setting setting = settingRepository.findById(newUserRequestDTO.getSettingId())
                .orElseThrow(() -> new IllegalArgumentException("Setting with provided ID not found"));
        user.setSetting(setting);
        Thread thread = new Thread(() -> sendAccount(user.getUsername(), password, newUserRequestDTO.getEmail()));
        thread.start();
        return userRepository.save(user);
    }

    public UserDetailDTO viewUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        UserDetailDTO userDetailDTO = userMapper.userToUserDetailDTO(user);
        userDetailDTO.setSettingName(user.getSetting().getName());
        userDetailDTO.setIsActive(user.isActive() ? "true" : "false");
        userDetailDTO.setShopNames(user.getShops().stream().map(Shop::getName).collect(Collectors.toList()));
        userDetailDTO.setNote(user.getNote());
        return userDetailDTO;
    }

    public User updateUserDetail(Long userId, UserDetailDTO userDetailDTO) {
        try {
            User existingUser = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

            // Chỉ cập nhật các trường không null từ DTO
            if (userDetailDTO.getFirstName() != null) {
                existingUser.setFirstName(userDetailDTO.getFirstName());
            }

            if (userDetailDTO.getLastName() != null) {
                existingUser.setLastName(userDetailDTO.getLastName());
            }

            if (userDetailDTO.getGender() != null) {
                existingUser.setGender(userDetailDTO.getGender());
            }

            if (userDetailDTO.getAddress() != null) {
                existingUser.setAddress(userDetailDTO.getAddress());
            }

            if (userDetailDTO.getAvatar() != null) {
                existingUser.setAvatar(userDetailDTO.getAvatar());
            }
            if (userDetailDTO.getIsActive() != null) {
                existingUser.setActive(Boolean.parseBoolean(userDetailDTO.getIsActive()));
            }
            if (userDetailDTO.getNote() != null) {
                existingUser.setNote(userDetailDTO.getNote());
            }


            // Setting update
            if (userDetailDTO.getSettingName() != null) {
                Setting setting = settingRepository.findByName(userDetailDTO.getSettingName());
                if (setting == null) {
                    throw new IllegalArgumentException("Setting not found with name: " + userDetailDTO.getSettingName());
                }
                existingUser.setSetting(setting);
            }

            // Update the shops linked to the user if provided
            if (userDetailDTO.getShopIds() != null && !userDetailDTO.getShopIds().isEmpty()) {
                List<Shop> shops = shopRepository.findAllById(userDetailDTO.getShopIds());
                existingUser.setShops(shops);
            }

            // Save the updated user
            User updatedUser = userRepository.save(existingUser);
            return updatedUser;

        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Update failed: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred during the update: " + e.getMessage());
        }
    }

    public List<SettingIdNameResponseDTO> getSettingNamesByTypeId(int typeId) {
        List<Object[]> results = settingRepository.findNamesAndIdsByTypeId(typeId);
        return results.stream()
                .map(result -> new SettingIdNameResponseDTO((Integer) result[0], (String) result[1]))
                .collect(Collectors.toList());
    }
    public List<SettingIdNameResponseDTO> getCategoryName(int typeId) {
        List<Object[]> results = settingRepository.findNamesAndIdsByTypeId(typeId);
        return results.stream()
                .map(result -> new SettingIdNameResponseDTO((Integer) result[0], (String) result[1]))
                .collect(Collectors.toList());
    }

    public List<ShopIdNameResponseDTO> getAllShopIdAndNames() {
        List<Shop> shops = shopRepository.findAll();
        return shops.stream()
                .map(shop -> new ShopIdNameResponseDTO(shop.getShopId(), shop.getName()))
                .collect(Collectors.toList());
    }

    public List<UserIdNameDTO> getUsersWithSettingId(Long settingId) {
        List<Object[]> results = userRepository.findAllBySettingId(settingId);
        return results.stream()
                .map(result -> new UserIdNameDTO((Long) result[0], (String) result[1]))
                .collect(Collectors.toList());
    }

    public void sendAccount(String username, String password, String emailSend) {
        String subject = "no-reply-email-IMS-system <Account created>";

        // HTML content for the email
        String htmlContent = "<html><body>" +
                "<h2>This email is from the E-Retail system,</h2>" +
                "<p>Your account has been created. Please use the following credentials to login:</p>" +
                "<p><strong>Username:</strong> " + username + "</p>" +
                "<p><strong>Password:</strong> " + password + "</p>" +
                "<p>If there is anything wrong, please reach out to the recruiter <offer recruiter owner account>. We are sorry for this inconvenience.</p>" +
                "<p>Thanks & Regards!<br>" +
                "IMS Team</p>" +
                "</body></html>";

        // Assuming emailServices is an instance or method that can send emails
        emailServices.sendEmail("interviewmanagement.fa.fpt@gmail.com", emailSend, subject, htmlContent);
    }

    @Transactional
    public void updateIsActiveById(Long id) {
        Optional<User> userOptional = userRepository.findByUserId(id);
        if (userOptional.isPresent()) {
            userRepository.toggleIsActiveById(id);
        } else {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
    }

}



