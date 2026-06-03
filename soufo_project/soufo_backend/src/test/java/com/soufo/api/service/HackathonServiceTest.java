package com.soufo.api.service;

import com.soufo.api.model.Hackathon;
import com.soufo.api.repository.HackathonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class HackathonServiceTest {

    @Mock
    private HackathonRepository hackathonRepository;

    @InjectMocks
    private HackathonService hackathonService;

    private Hackathon testHackathon;

    @BeforeEach
    void setUp() {
        testHackathon = Hackathon.builder()
                .id(1L)
                .title("Tech Hackathon 2026")
                .description("A hackathon for innovative tech solutions")
                .startDate(LocalDateTime.now().plusDays(1))
                .endDate(LocalDateTime.now().plusDays(3))
                .location("São Paulo, Brazil")
                .build();
    }

    @Test
    void testFindHackathonById() {
        when(hackathonRepository.findById(1L))
                .thenReturn(Optional.of(testHackathon));

        Optional<Hackathon> result = hackathonService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Tech Hackathon 2026", result.get().getTitle());
        verify(hackathonRepository, times(1)).findById(1L);
    }

    @Test
    void testHackathonNotFound() {
        when(hackathonRepository.findById(999L))
                .thenReturn(Optional.empty());

        Optional<Hackathon> result = hackathonService.findById(999L);

        assertFalse(result.isPresent());
    }

    @Test
    void testSaveHackathon() {
        when(hackathonRepository.save(any(Hackathon.class)))
                .thenReturn(testHackathon);

        var savedHackathon = hackathonService.saveHackathon(testHackathon);

        assertNotNull(savedHackathon);
        assertEquals("Tech Hackathon 2026", savedHackathon.getTitle());
        verify(hackathonRepository, times(1)).save(testHackathon);
    }

    @Test
    void testHackathonValidation() {
        assertNotNull(testHackathon.getTitle());
        assertNotNull(testHackathon.getStartDate());
        assertNotNull(testHackathon.getEndDate());
        assertTrue(testHackathon.getStartDate().isBefore(testHackathon.getEndDate()));
    }
}
