package com.za.testexe.mapper;

import com.za.testexe.model.dto.request.risparmio.RisparmioRequest;
import com.za.testexe.model.dto.response.risparmio.RisparmioResponse;
import com.za.testexe.model.entity.RisparmioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RisparmioMapper {

    RisparmioEntity toEntity(RisparmioRequest request);

    RisparmioResponse toDto(RisparmioEntity entity);

    @Mapping(target = "idRisparmio", ignore = true)
    void updateEntity(RisparmioRequest request, @MappingTarget RisparmioEntity entity);
}
