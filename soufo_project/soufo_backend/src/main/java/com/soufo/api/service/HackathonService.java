package com.soufo.api.service;

import com.soufo.api.model.Hackathon;
import com.soufo.api.repository.HackathonRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HackathonService {

    private final HackathonRepository hackathonRepository;

    public HackathonService(HackathonRepository hackathonRepository) {
        this.hackathonRepository = hackathonRepository;
    }

    public Optional<Hackathon> findById(Long id) {
        return hackathonRepository.findById(id);
    }

    public Hackathon saveHackathon(Hackathon hackathon) {
        return hackathonRepository.save(hackathon);
    }
}
