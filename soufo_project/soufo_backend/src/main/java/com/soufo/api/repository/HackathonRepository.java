package com.soufo.api.repository;

import com.soufo.api.model.Hackathon;
import java.util.Optional;

public interface HackathonRepository {
    Optional<Hackathon> findById(Long id);
    Hackathon save(Hackathon hackathon);
}
