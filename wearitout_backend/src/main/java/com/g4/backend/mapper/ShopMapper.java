package com.g4.backend.mapper;

import com.g4.backend.dto.ShopDetailDTO;
import com.g4.backend.dto.response.ShopsResponseDTO;
import com.g4.backend.model.Shop;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ShopMapper {

    ShopsResponseDTO shopToShopsResponseDto(Shop shop);
    ShopDetailDTO shopToShopDetailDTO(Shop shop);
}
