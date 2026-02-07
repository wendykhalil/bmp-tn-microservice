package tn.esprit.projectwebdist.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateProjectRequest {
    @NotNull
    private Long artisanId;

    @NotBlank
    private String title;

    private String description;
    private String location;

    private LocalDate startDate;
    private LocalDate endDate;

    @NotNull
    @PositiveOrZero
    private Double budget;
}