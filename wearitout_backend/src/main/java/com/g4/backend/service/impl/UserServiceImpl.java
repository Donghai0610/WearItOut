package com.g4.backend.service.impl;

import com.g4.backend.model.enity.Role;
import com.g4.backend.repository.RoleRepository;
import com.g4.backend.repository.UserRepository;
import com.g4.backend.repository.UserRoleRepository;
import com.g4.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private UserRoleRepository userRoleRepository;

    @Autowired
    public UserServiceImpl(RoleRepository roleRepository, UserRepository userRepository, UserRoleRepository userRoleRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
    }



    @Override
    public Role getRoleDefault() {
        return null;
    }
}
