package com.g4.backend.controller;

import com.g4.backend.dto.UserDetailDTO;
import com.g4.backend.dto.request.UserRegisterRequestDTO;
import com.g4.backend.dto.response.ApiResponse;
import com.g4.backend.dto.response.ResponseDTO;
import com.g4.backend.model.User;
import com.g4.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {


    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> registerUser(@RequestBody UserRegisterRequestDTO userRegisterRequestDTO) {
        try {
            User savedUser = userService.saveUser(userRegisterRequestDTO);

            savedUser.setPassword(null);
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .code(HttpStatus.OK.value())
                            .message("User registered successfully.")
                            .result(savedUser)
                            .build()
            );
        } catch (Exception e) {
            ResponseEntity.ok(
                    ApiResponse.builder()
                            .code(HttpStatus.BAD_REQUEST.value())
                            .message(e.getMessage())
                            .result(null)
                            .build()
            );
        }
        return null;
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



}
