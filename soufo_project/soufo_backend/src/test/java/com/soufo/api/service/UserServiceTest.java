package com.soufo.api.service;

import com.soufo.api.model.User;
import com.soufo.api.model.Role;
import com.soufo.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encoded_password")
                .firstName("Test")
                .lastName("User")
                .role(Role.USER)
                .enabled(true)
                .build();
    }

    @Test
    void testFindUserByEmail() {
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(java.util.Optional.of(testUser));

        var result = userService.findByEmail("test@example.com");

        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testUserNotFound() {
        when(userRepository.findByEmail("notfound@example.com"))
                .thenReturn(java.util.Optional.empty());

        var result = userService.findByEmail("notfound@example.com");

        assertFalse(result.isPresent());
    }

    @Test
    void testSaveUser() {
        when(passwordEncoder.encode(any(String.class))).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        var savedUser = userService.saveUser(testUser);

        assertNotNull(savedUser);
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("encoded_password", savedUser.getPassword());
        verify(passwordEncoder, times(1)).encode(any(String.class));
        verify(userRepository, times(1)).save(testUser);
    }
}
