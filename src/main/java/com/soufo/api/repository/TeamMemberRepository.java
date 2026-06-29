package com.soufo.api.repository;

import com.soufo.api.model.TeamMember;
import com.soufo.api.model.TeamMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, TeamMemberId> {
    boolean existsById(TeamMemberId id);
    boolean existsByIdTeamIdAndIdUserId(Long teamId, Long userId);
}
