package com.soufo.api.controller;

import com.soufo.api.dto.AuthRequest;
import com.soufo.api.dto.AuthResponse;
import com.soufo.api.dto.RegisterRequest;
import com.soufo.api.model.User;
import com.soufo.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Autenticação", description = "Cadastro, login e autenticação do usuário")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Registrar novo usuário",
            description = "Cria um novo usuário no sistema e retorna um token de acesso."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados obrigatórios ausentes ou inválidos"),
            @ApiResponse(responseCode = "409", description = "Usuário já cadastrado")
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null
                || request.getFirstName() == null || request.getLastName() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (userService.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEnabled(true);
        userService.saveUser(user);

        AuthResponse response = new AuthResponse();
        response.setToken("token-" + UUID.randomUUID());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
            summary = "Autenticar usuário",
            description = "Valida e-mail e senha e retorna os dados do usuário autenticado com token."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return userService.authenticate(request.getEmail(), request.getPassword())
                .map(user -> {
                    AuthResponse response = new AuthResponse();
                    response.setToken("token-" + UUID.randomUUID());
                    response.setEmail(user.getEmail());
                    response.setFirstName(user.getFirstName());
                    response.setLastName(user.getLastName());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
