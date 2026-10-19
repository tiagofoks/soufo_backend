package com.soufo.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "RegisterRequest", description = "Dados para criação de um novo usuário")
public class RegisterRequest {
    @Schema(description = "E-mail do usuário", example = "novo@email.com")
    private String email;
    @Schema(description = "Senha para acesso do usuário", example = "senhaSegura123")
    private String password;
    @Schema(description = "Primeiro nome do usuário", example = "João")
    private String firstName;
    @Schema(description = "Sobrenome do usuário", example = "Souza")
    private String lastName;

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
