package com.t3.mapper;

import com.t3.dto.ShopDetailDTO;
import com.t3.dto.ShopDetailDTO.ShopDetailDTOBuilder;
import com.t3.dto.response.ShopsResponseDTO;
import com.t3.dto.response.ShopsResponseDTO.ShopsResponseDTOBuilder;
import com.t3.model.Shop;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-28T13:09:02+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.10 (Oracle Corporation)"
)
@Component
public class ShopMapperImpl implements ShopMapper {

    @Override
    public ShopsResponseDTO shopToShopsResponseDto(Shop shop) {
        if ( shop == null ) {
            return null;
        }

        ShopsResponseDTOBuilder shopsResponseDTO = ShopsResponseDTO.builder();

        shopsResponseDTO.shopId( shop.getShopId() );
        shopsResponseDTO.rating( shop.getRating() );

        return shopsResponseDTO.build();
    }

    @Override
    public ShopDetailDTO shopToShopDetailDTO(Shop shop) {
        if ( shop == null ) {
            return null;
        }

        ShopDetailDTOBuilder shopDetailDTO = ShopDetailDTO.builder();

        shopDetailDTO.shopId( shop.getShopId() );
        shopDetailDTO.rating( shop.getRating() );

        return shopDetailDTO.build();
    }
}
