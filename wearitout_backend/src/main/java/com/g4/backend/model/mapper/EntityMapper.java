package com.g4.backend.model.mapper;

import org.mapstruct.Mapper;

import java.util.List;
@Mapper
public interface EntityMapper<D, E> {

    E toEntity(D dto);

    D toDto(E entity);

    List<E> toEntity(List<D> dtoList);

    List<D> toDto(List<E> entityList);
}
