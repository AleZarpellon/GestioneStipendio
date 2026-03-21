package com.za.testexe.mapper;

import com.za.testexe.model.dto.request.stipendio.StipendioRequest;
import com.za.testexe.model.dto.response.stipendio.StipendioResponse;
import com.za.testexe.model.entity.StipendioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StipendioMapper {

    @Mapping(target = "dataFine", ignore = true)
    @Mapping(target = "nrSettimane", ignore = true)
    StipendioEntity toEntity(StipendioRequest request);

    StipendioResponse toDto(StipendioEntity entity);

    @Mapping(target = "idStipendio", ignore = true)
    @Mapping(target = "dataFine", ignore = true)
    @Mapping(target = "nrSettimane", ignore = true)
    void updateEntity(StipendioRequest request, @MappingTarget StipendioEntity entity);
}
