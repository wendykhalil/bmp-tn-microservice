package tn.esprit.projectwebdist.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.projectwebdist.model.Project;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByArtisanId(Long artisanId);
}
