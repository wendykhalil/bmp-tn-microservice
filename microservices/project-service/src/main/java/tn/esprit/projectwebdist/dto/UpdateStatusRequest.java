package tn.esprit.projectwebdist.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tn.esprit.projectwebdist.model.ProjectStatus;

@Data
public class UpdateStatusRequest {
    @NotNull
    private ProjectStatus status;
}
