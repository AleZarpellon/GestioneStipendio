package com.za.testexe.mapper;

import com.za.testexe.model.dto.request.budgetSettimanale.BudgetSettimanaleRequest;
import com.za.testexe.model.dto.response.BudgetSettimanale.BudgetSettimanaleResponse;
import com.za.testexe.model.entity.BudgetSettimanaleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BudgetSettimanaleMapper {

    @Mapping(target = "rimanente", ignore = true)
    BudgetSettimanaleEntity toEntity(BudgetSettimanaleRequest request);

    BudgetSettimanaleResponse toDto(BudgetSettimanaleEntity entity);

    @Mapping(target = "idSettimana", ignore = true)
    @Mapping(target = "rimanente", ignore = true)
    @Mapping(target = "soldiXSettimana", ignore = true)
    void updateEntity(BudgetSettimanaleRequest request, @MappingTarget BudgetSettimanaleEntity entity);
}
