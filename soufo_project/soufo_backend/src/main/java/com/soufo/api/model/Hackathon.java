package com.soufo.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hackathons")
public class Hackathon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "location")
    private String location;

    @Column(name = "organizer_id")
    private Long organizerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PLANNING;

    public enum Status {
        PLANNING,
        OPEN,
        IN_PROGRESS,
        CLOSED,
        ARCHIVED
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private final Hackathon instance = new Hackathon();

        public Builder id(Long id) {
            instance.setId(id);
            return this;
        }

        public Builder title(String title) {
            instance.setTitle(title);
            return this;
        }

        public Builder description(String description) {
            instance.setDescription(description);
            return this;
        }

        public Builder startDate(LocalDateTime startDate) {
            instance.setStartDate(startDate);
            return this;
        }

        public Builder endDate(LocalDateTime endDate) {
            instance.setEndDate(endDate);
            return this;
        }

        public Builder location(String location) {
            instance.setLocation(location);
            return this;
        }

        public Builder organizerId(Long organizerId) {
            instance.setOrganizerId(organizerId);
            return this;
        }

        public Builder status(Status status) {
            instance.setStatus(status);
            return this;
        }

        public Hackathon build() {
            return instance;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
