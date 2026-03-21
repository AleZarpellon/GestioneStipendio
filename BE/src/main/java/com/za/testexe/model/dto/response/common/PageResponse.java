package com.za.testexe.model.dto.response.common;

import java.util.List;
import org.springframework.data.domain.Page;

/**
 * Standard paginated response wrapper.
 *
 * @param <T>           Type of the content items
 * @param content       List of items in the current page
 * @param page          Current page number (0-indexed)
 * @param size          Page size
 * @param totalElements Total number of elements across all pages
 * @param totalPages    Total number of pages
 * @param first         Whether this is the first page
 * @param last          Whether this is the last page
 */
public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last
) {

  /**
   * Creates a PageResponse from a Spring Data Page.
   */
  public static <T> PageResponse<T> from(Page<T> page) {
    return new PageResponse<>(
        page.getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast()
    );
  }

  /**
   * Creates a PageResponse from a Spring Data Page with mapped content.
   */
  public static <T, U> PageResponse<U> from(Page<T> page, List<U> content) {
    return new PageResponse<>(
        content,
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast()
    );
  }
}
