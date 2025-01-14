package com.g4.backend.mapper;



import com.g4.backend.dto.UserDetailDTO;
import com.g4.backend.dto.request.NewUserRequestDTO;
import com.g4.backend.dto.request.UserRegisterRequestDTO;
import com.g4.backend.dto.response.UsersResponseDTO;
import com.g4.backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {


    User userDTOToUser(UserRegisterRequestDTO userRegisterRequestDTO);
    @Mapping(source = "setting.name", target = "settingName")
    @Mapping(target = "isActive", expression = "java(user.isActive() ? \"1\" : \"0\")")
    UsersResponseDTO userToUserResponseDTO(User user);
    User addnewUser(NewUserRequestDTO userRegisterRequestDTO);
    @Mapping(source = "setting.name", target = "settingName")
    @Mapping(target = "isActive", expression = "java(user.isActive() ? \"1\" : \"0\")")
    UserDetailDTO userToUserDetailDTO(User user);

}
