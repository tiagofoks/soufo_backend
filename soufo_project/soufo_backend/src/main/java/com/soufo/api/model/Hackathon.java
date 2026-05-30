package com.soufo.api.model;

import java.time.LocalDateTime;

public class Hackathon {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    private int maxParticipants;

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private final Hackathon instance = new Hackathon();

        public Builder id(Long id) {
            instance.setId(id);
            return this;
        }

        public Builder name(String name) {
            instance.setName(name);
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

        public Builder maxParticipants(int maxParticipants) {
            instance.setMaxParticipants(maxParticipants);
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public int getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(int maxParticipants) {
        this.maxParticipants = maxParticipants;
    }
}
