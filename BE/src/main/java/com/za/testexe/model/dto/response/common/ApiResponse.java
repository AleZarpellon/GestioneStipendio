package com.za.testexe.model.dto.response.common;

import java.time.LocalDateTime;

/**
 * Standard API response wrapper for successful operations.
 *
 * @param <T>       Type of the data payload
 * @param success   Whether the operation was successful
 * @param message   Human-readable message describing the result
 * @param data      The response data payload
 * @param timestamp Response generation timestamp
 */
public record ApiResponse<T>(
    boolean success,
    String message,
    T data,
    LocalDateTime timestamp
) {

  /**
   * Creates a successful response with data.
   */
  public static <T> ApiResponse<T> success(T data) {
    return new ApiResponse<>(true, "Success", data, LocalDateTime.now());
  }

  /**
   * Creates a successful response with data and custom message.
   */
  public static <T> ApiResponse<T> success(String message, T data) {
    return new ApiResponse<>(true, message, data, LocalDateTime.now());
  }

  /**
   * Creates a successful response without data.
   */
  public static <Void> ApiResponse<Void> success(String message) {
    return new ApiResponse<>(true, message, null, LocalDateTime.now());
  }

  /**
   * Creates an error response.
   */
  public static <T> ApiResponse<T> error(String message) {
    return new ApiResponse<>(false, message, null, LocalDateTime.now());
  }

  /**
   * Creates an error response with data.
   */
  public static <T> ApiResponse<T> error(String message, T data) {
    return new ApiResponse<>(false, message, data, LocalDateTime.now());
  }
}
