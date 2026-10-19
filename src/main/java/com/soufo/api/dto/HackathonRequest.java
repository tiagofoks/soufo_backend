package com.soufo.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "HackathonRequest", description = "Dados para cadastro de um novo hackathon")
public class HackathonRequest {
    @Schema(description = "Título do hackathon", example = "Hackathon de IA 2026")
    private String title;
    @Schema(description = "Descrição do evento", example = "Competição de soluções em inteligência artificial")
    private String description;
    @Schema(description = "Local do evento", example = "São Paulo - SP")
    private String location;
    @Schema(description = "Data e hora de início no formato ISO-8601", example = "2026-11-15T09:00:00")
    private String startDateTime;
    @Schema(description = "Data e hora de término no formato ISO-8601", example = "2026-11-16T18:00:00")
    private String endDateTime;
    @Schema(description = "Identificador do organizador do hackathon", example = "1")
    private Long organizerId;

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(String startDateTime) {
        this.startDateTime = startDateTime;
    }

    public String getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(String endDateTime) {
        this.endDateTime = endDateTime;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }
}
