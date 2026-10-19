package com.soufo.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "RegistrationResponse", description = "Resposta após inscrição com sucesso no hackathon")
public class RegistrationResponse {
    @Schema(description = "Identificador da equipe", example = "12")
    private Long teamId;
    @Schema(description = "Nome da equipe", example = "Equipe Alpha")
    private String teamName;
    @Schema(description = "Identificador do hackathon", example = "3")
    private Long hackathonId;
    @Schema(description = "E-mail do usuário inscrito", example = "participante@email.com")
    private String userEmail;
    @Schema(description = "Data e hora da inscrição", example = "2026-10-19T14:30:00")
    private LocalDateTime joinedAt;

    public RegistrationResponse() {
    }

    public RegistrationResponse(Long teamId, String teamName, Long hackathonId, String userEmail, LocalDateTime joinedAt) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.hackathonId = hackathonId;
        this.userEmail = userEmail;
        this.joinedAt = joinedAt;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Long getHackathonId() {
        return hackathonId;
    }

    public void setHackathonId(Long hackathonId) {
        this.hackathonId = hackathonId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
