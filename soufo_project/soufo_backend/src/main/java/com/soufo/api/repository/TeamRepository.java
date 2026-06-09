package com.soufo.api.repository;

import com.soufo.api.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByHackathonId(Long hackathonId);
    Optional<Team> findByHackathonIdAndName(Long hackathonId, String name);
}
