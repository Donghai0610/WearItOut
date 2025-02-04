package com.g4.backend.controller;

import com.g4.backend.dto.UserDetailDTO;
import com.g4.backend.dto.request.UserRegisterRequestDTO;
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
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterRequestDTO userRegisterRequestDTO) {
        try {
            User savedUser = userService.saveUser(userRegisterRequestDTO);

            savedUser.setPassword(null);

            ResponseDTO response = ResponseDTO.builder()
                    .code(HttpStatus.CREATED.value())
                    .message("User registered successfully")
                    .data(savedUser)
                    .build();

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            ResponseDTO response = ResponseDTO.builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .data(null)
                    .build();
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ResponseDTO response = ResponseDTO.builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("An error occurred while registering the user.")
                    .data(null)
                    .build();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
