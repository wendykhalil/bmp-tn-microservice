package tn.esprit.projectwebdist.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.projectwebdist.model.ChantierUpdate;

import java.util.List;

public interface ChantierUpdateRepository extends JpaRepository<ChantierUpdate, Long> {
    List<ChantierUpdate> findByProject_IdOrderByCreatedAtDesc(Long projectId);
}

