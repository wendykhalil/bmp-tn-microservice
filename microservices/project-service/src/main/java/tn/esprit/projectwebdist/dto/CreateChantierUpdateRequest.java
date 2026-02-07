package tn.esprit.projectwebdist.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateChantierUpdateRequest {

    @NotNull
    @Min(0)
    @Max(100)
    private Integer progressPercent;

    private String note;
}

