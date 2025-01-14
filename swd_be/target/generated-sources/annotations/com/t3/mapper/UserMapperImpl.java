package com.t3.mapper;

import com.t3.dto.UserDetailDTO;
import com.t3.dto.UserDetailDTO.UserDetailDTOBuilder;
import com.t3.dto.request.NewUserRequestDTO;
import com.t3.dto.request.UserRegisterRequestDTO;
import com.t3.dto.response.UsersResponseDTO;
import com.t3.dto.response.UsersResponseDTO.UsersResponseDTOBuilder;
import com.t3.model.Setting;
import com.t3.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-27T20:21:19+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.10 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User userDTOToUser(UserRegisterRequestDTO userRegisterRequestDTO) {
        if ( userRegisterRequestDTO == null ) {
            return null;
        }

        User user = new User();

        user.setUsername( userRegisterRequestDTO.getUsername() );
        user.setPassword( userRegisterRequestDTO.getPassword() );
        user.setEmail( userRegisterRequestDTO.getEmail() );
        user.setPhone( userRegisterRequestDTO.getPhone() );

        return user;
    }

    @Override
    public UsersResponseDTO userToUserResponseDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UsersResponseDTOBuilder usersResponseDTO = UsersResponseDTO.builder();

        usersResponseDTO.settingName( userSettingName( user ) );
        usersResponseDTO.userId( user.getUserId() );
        usersResponseDTO.username( user.getUsername() );
        usersResponseDTO.email( user.getEmail() );
        usersResponseDTO.phone( user.getPhone() );

        usersResponseDTO.isActive( user.isActive() ? "1" : "0" );

        return usersResponseDTO.build();
    }

    @Override
    public User addnewUser(NewUserRequestDTO userRegisterRequestDTO) {
        if ( userRegisterRequestDTO == null ) {
            return null;
        }

        User user = new User();

        user.setUsername( userRegisterRequestDTO.getUsername() );
        user.setEmail( userRegisterRequestDTO.getEmail() );

        return user;
    }

    @Override
    public UserDetailDTO userToUserDetailDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDetailDTOBuilder userDetailDTO = UserDetailDTO.builder();

        userDetailDTO.settingName( userSettingName( user ) );
        userDetailDTO.userId( user.getUserId() );
        userDetailDTO.username( user.getUsername() );
        userDetailDTO.firstName( user.getFirstName() );
        userDetailDTO.lastName( user.getLastName() );
        userDetailDTO.email( user.getEmail() );
        userDetailDTO.gender( user.getGender() );
        userDetailDTO.address( user.getAddress() );
        userDetailDTO.phone( user.getPhone() );
        userDetailDTO.avatar( user.getAvatar() );
        userDetailDTO.note( user.getNote() );
        userDetailDTO.createAt( user.getCreateAt() );
        userDetailDTO.updateAt( user.getUpdateAt() );

        userDetailDTO.isActive( user.isActive() ? "1" : "0" );

        return userDetailDTO.build();
    }

    private String userSettingName(User user) {
        if ( user == null ) {
            return null;
        }
        Setting setting = user.getSetting();
        if ( setting == null ) {
            return null;
        }
        String name = setting.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
