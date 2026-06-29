package com.soufo.api.controller;

import com.soufo.api.dto.HackathonRequest;
import com.soufo.api.dto.RegistrationRequest;
import com.soufo.api.dto.RegistrationResponse;
import com.soufo.api.model.Hackathon;
import com.soufo.api.model.Team;
import com.soufo.api.model.TeamMember;
import com.soufo.api.model.User;
import com.soufo.api.repository.TeamMemberRepository;
import com.soufo.api.repository.TeamRepository;
import com.soufo.api.repository.UserRepository;
import com.soufo.api.service.HackathonService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/hackathons")
@CrossOrigin(origins = "http://localhost:4200")
public class HackathonController {
    private final HackathonService hackathonService;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    public HackathonController(HackathonService hackathonService, UserRepository userRepository, TeamRepository teamRepository, TeamMemberRepository teamMemberRepository) {
        this.hackathonService = hackathonService;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
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

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerForHackathon(@PathVariable("id") Long hackathonId, @RequestBody RegistrationRequest request) {
        if (request == null || request.getEmail() == null) {
            return ResponseEntity.badRequest().body("Email é obrigatório para inscrição");
        }

        if (request.getTeamId() == null && request.getTeamName() == null) {
            return ResponseEntity.badRequest().body("Informe o nome ou o ID da equipe para se inscrever.");
        }

        var optUser = userRepository.findByEmail(request.getEmail());
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado. Cadastre-se antes de inscrever-se.");
        }

        User user = optUser.get();
        Team team = null;

        if (request.getTeamId() != null) {
            var optTeam = teamRepository.findById(request.getTeamId());
            if (optTeam.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Equipe não encontrada.");
            }
            team = optTeam.get();
            if (!team.getHackathonId().equals(hackathonId)) {
                return ResponseEntity.badRequest().body("A equipe selecionada não pertence a este hackathon.");
            }
        } else if (request.getTeamName() != null) {
            team = teamRepository.findByHackathonIdAndName(hackathonId, request.getTeamName()).orElse(null);
            if (team == null) {
                team = new Team();
                team.setHackathonId(hackathonId);
                team.setName(request.getTeamName());
                team.setLeaderId(user.getId());
                team = teamRepository.save(team);
            }
        }

        if (team == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Não foi possível determinar a equipe para inscrição.");
        }

        if (teamMemberRepository.existsByIdTeamIdAndIdUserId(team.getId(), user.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Usuário já está registrado nesta equipe.");
        }

        TeamMember membership = new TeamMember(team, user);
        TeamMember savedMembership = teamMemberRepository.save(membership);
        RegistrationResponse response = new RegistrationResponse(
                team.getId(),
                team.getName(),
                team.getHackathonId(),
                user.getEmail(),
                savedMembership.getJoinedAt()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private LocalDateTime parseDateTime(String dateTime) {
        return LocalDateTime.parse(dateTime);
    }
}
