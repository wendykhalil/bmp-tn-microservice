package tn.esprit.projectwebdist.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProjectRequest {
    private String title;
    private String description;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;

    @PositiveOrZero
    private Double budget;
}
