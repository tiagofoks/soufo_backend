package com.soufo.api.controller;

import com.soufo.api.dto.AuthRequest;
import com.soufo.api.dto.AuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = new AuthResponse();
        response.setToken("mock-token-for:" + request.getEmail());
        return ResponseEntity.ok(response);
    }
}
