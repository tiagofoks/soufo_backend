package com.soufo.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "RegistrationRequest", description = "Dados para inscrição de um participante em um hackathon")
public class RegistrationRequest {
    @Schema(description = "E-mail do participante", example = "participante@email.com")
    private String email;
    @Schema(description = "Nome da equipe a ser usada na inscrição, quando não houver equipe cadastrada", example = "Equipe Alpha")
    private String teamName;
    @Schema(description = "Identificador da equipe já existente", example = "12")
    private Long teamId;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }
}
