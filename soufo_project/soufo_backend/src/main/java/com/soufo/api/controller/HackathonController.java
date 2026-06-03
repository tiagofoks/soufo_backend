package com.soufo.api.controller;

import com.soufo.api.dto.HackathonRequest;
import com.soufo.api.model.Hackathon;
import com.soufo.api.service.HackathonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
@CrossOrigin(origins = "http://localhost:4200")
public class HackathonController {

    private final HackathonService hackathonService;

    public HackathonController(HackathonService hackathonService) {
        this.hackathonService = hackathonService;
    }

    @GetMapping
    public ResponseEntity<List<Hackathon>> getAllHackathons() {
        return ResponseEntity.ok(hackathonService.findAll());
    }

    @PostMapping
    public ResponseEntity<Hackathon> createHackathon(@RequestBody HackathonRequest request) {
        if (request == null || request.getTitle() == null || request.getStartDateTime() == null || request.getEndDateTime() == null) {
            return ResponseEntity.badRequest().build();
        }

        Hackathon hackathon = new Hackathon();
        hackathon.setTitle(request.getTitle());
        hackathon.setDescription(request.getDescription());
        hackathon.setLocation(request.getLocation());
        hackathon.setOrganizerId(request.getOrganizerId());
        hackathon.setStartDate(parseDateTime(request.getStartDateTime()));
        hackathon.setEndDate(parseDateTime(request.getEndDateTime()));
        hackathon.setStatus(Hackathon.Status.OPEN);

        Hackathon savedHackathon = hackathonService.saveHackathon(hackathon);
        return ResponseEntity.status(201).body(savedHackathon);
    }

    private LocalDateTime parseDateTime(String dateTime) {
        return LocalDateTime.parse(dateTime);
    }
}
