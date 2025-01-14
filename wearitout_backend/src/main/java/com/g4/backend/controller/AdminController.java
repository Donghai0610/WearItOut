package com.g4.backend.controller;

import com.g4.backend.dto.*;
import com.g4.backend.dto.request.NewShopRequestDTO;
import com.g4.backend.dto.request.NewUserRequestDTO;
import com.g4.backend.dto.response.*;
import com.g4.backend.mapper.UserMapper;
import com.g4.backend.model.Shop;
import com.g4.backend.model.User;
import com.g4.backend.service.ShopService;
import com.g4.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final UserService userService;
    private  final UserMapper userMapper;
    private final ShopService shopService;

    @Autowired
    public AdminController(UserService userService, UserMapper userMapper, ShopService shopService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.shopService = shopService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "isActive", required = false) String isActive,
            @RequestParam(value = "shop", required = false) String shop,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<UsersResponseDTO> userPage = userService.searchUsers(keyword, role, isActive, shop, page, size);
        List<UsersResponseDTO> content = userPage.getContent();
        return ResponseEntity.ok(new SearchResponse(content, userPage.getTotalPages()));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody NewUserRequestDTO newUserRequestDTO) {
        User user = userService.addNewUser(newUserRequestDTO);
        if (user == null) {
            return ResponseEntity.badRequest().body(ResponseDTO.builder().code(400).message("Save user fail!").data(user).build());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseDTO.builder().code(200).message("User created successfully").data(user).build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> viewUserDetail(@PathVariable Long userId) {
        try {
            UserDetailDTO userDetail = userService.viewUserDetail(userId);
            return new ResponseEntity<>(userDetail, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/update/{userId}")
    public ResponseEntity<?> updateUserDetail(@PathVariable Long userId, @RequestBody UserDetailDTO userDetailDTO) {
        try {
            User updatedUser = userService.updateUserDetail(userId, userDetailDTO);
            UserDetailDTO responseDTO = userMapper.userToUserDetailDTO(updatedUser);
            responseDTO.setIsActive(updatedUser.isActive() ? "true" : "false");
            responseDTO.setShopNames(updatedUser.getShops().stream().map(Shop::getName).collect(Collectors.toList()));
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/settings/{typeId}")
    public ResponseEntity<?> getSettingNamesByTypeId(@PathVariable int typeId) {
        try {
            List<SettingIdNameResponseDTO> settingNames = userService.getSettingNamesByTypeId(typeId);
            return new ResponseEntity<>(settingNames, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/shops")
    public ResponseEntity<?> getAllShopIdAndNames() {
        try {
            List<ShopIdNameResponseDTO> shopList = userService.getAllShopIdAndNames();
            return new ResponseEntity<>(shopList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/shop/search")
    public ResponseEntity<?> searchShops(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "isActive", required = false) String isActive,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<ShopsResponseDTO> shopPage = shopService.searchShops(keyword, category, isActive, page, size);
        List<ShopsResponseDTO> content = shopPage.getContent();
        return ResponseEntity.ok(new SearchResponse(content, shopPage.getTotalPages()));
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<?> viewShopDetail(@PathVariable Long shopId) {
        try {
            ShopDetailDTO shopDetail = shopService.viewShopDetail(shopId);
            return new ResponseEntity<>(shopDetail, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/updateshop/{shopId}")
    public ResponseEntity<?> updateShopDetail(@PathVariable Long shopId, @RequestBody ShopDetailDTO shopDetailDTO) {
        try {
            ResponseDTO updatedShop = shopService.updateShopDetail(shopId, shopDetailDTO);
            return new ResponseEntity<>(updatedShop.getMessage(), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/users/setting-type/{settingId}")
    public ResponseEntity<?> getUserBySettingId(@PathVariable Long settingId) {
        try {
            List<UserIdNameDTO> userNames = userService.getUsersWithSettingId(settingId);
            return new ResponseEntity<>(userNames, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/shop/create")
    public ResponseEntity<?> createShop(@RequestBody NewShopRequestDTO newShopRequestDTO) {
        try {
            ResponseDTO addShop = shopService.addNewShop(newShopRequestDTO);
            return new ResponseEntity<>(addShop.getMessage(), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/update-active/{userId}")
    public ResponseEntity<?> toggleUserActiveStatus(@PathVariable Long userId) {
        try {
            userService.updateIsActiveById(userId);  // Call the correct service method
            return ResponseEntity.ok().body(ResponseDTO.builder().code(200).message("Successfully updated user status.").build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ResponseDTO.builder().code(400).message(e.getMessage()).build());
        }
    }

}
