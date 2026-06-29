package com.soufo.api.dto;

import java.time.LocalDateTime;

public class RegistrationResponse {
    private Long teamId;
    private String teamName;
    private Long hackathonId;
    private String userEmail;
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
