package com.soufo.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AuthResponse", description = "Resposta após autenticação ou cadastro")
public class AuthResponse {
    @Schema(description = "Token de acesso gerado para o usuário", example = "token-12345")
    private String token;
    @Schema(description = "E-mail do usuário autenticado", example = "usuario@email.com")
    private String email;
    @Schema(description = "Primeiro nome do usuário", example = "Maria")
    private String firstName;
    @Schema(description = "Sobrenome do usuário", example = "Silva")
    private String lastName;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
