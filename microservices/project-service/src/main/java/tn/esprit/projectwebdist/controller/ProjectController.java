package tn.esprit.projectwebdist.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.projectwebdist.dto.*;
import tn.esprit.projectwebdist.model.*;
import tn.esprit.projectwebdist.service.ProjectService;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public Project create(@Valid @RequestBody CreateProjectRequest req) {
        return projectService.create(req);
    }

    @GetMapping
    public List<Project> listAll() {
        return projectService.listAll();
    }

    @GetMapping("/{id}")
    public Project get(@PathVariable Long id) {
        return projectService.get(id);
    }

    @GetMapping("/artisan/{artisanId}")
    public List<Project> listByArtisan(@PathVariable Long artisanId) {
        return projectService.listByArtisan(artisanId);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @Valid @RequestBody UpdateProjectRequest req) {
        return projectService.update(id, req);
    }

    @PatchMapping("/{id}/status")
    public Project updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest req) {
        return projectService.updateStatus(id, req);
    }

    @PostMapping("/{id}/updates")
    public ChantierUpdate addUpdate(@PathVariable Long id, @Valid @RequestBody CreateChantierUpdateRequest req) {
        return projectService.addUpdate(id, req);
    }

    @GetMapping("/{id}/updates")
    public List<ChantierUpdate> listUpdates(@PathVariable Long id) {
        return projectService.listUpdates(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }

}
