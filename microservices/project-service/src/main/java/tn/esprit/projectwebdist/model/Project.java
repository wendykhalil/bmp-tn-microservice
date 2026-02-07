package tn.esprit.projectwebdist.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long artisanId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String location;

    private LocalDate startDate;
    private LocalDate endDate;

    private Double budget;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;
}