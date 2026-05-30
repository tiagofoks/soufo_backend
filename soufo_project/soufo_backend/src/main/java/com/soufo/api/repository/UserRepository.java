package com.soufo.api.repository;

import com.soufo.api.model.User;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    User save(User user);
}
