package com.soufo.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AuthRequest", description = "Credenciais para autenticação do usuário")
public class AuthRequest {
    @Schema(description = "E-mail do usuário para login", example = "usuario@email.com")
    private String email;
    @Schema(description = "Senha do usuário", example = "123456")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
