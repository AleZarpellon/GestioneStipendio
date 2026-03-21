package com.za.testexe.model.dto.response.common;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
        int status,
        String error,
        String message,
        String path,
        LocalDateTime timestamp,
        Map<String, String> validationErrors
) {
    public static ErrorResponse of(int status, String error, String message, String path){
        return new ErrorResponse(status, error, message, path, LocalDateTime.now(), null);
    }
    public static ErrorResponse withValidationErrors(int status, String error, String message, String path, Map<String, String> validationErrors){
        return new ErrorResponse(status, error, message, path, LocalDateTime.now(), validationErrors);
    }
}
