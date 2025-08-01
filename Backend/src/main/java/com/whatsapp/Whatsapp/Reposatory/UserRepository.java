package com.whatsapp.Whatsapp.Reposatory;

import com.whatsapp.Whatsapp.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);  // ✅ this is what your AuthService uses
    boolean existsByEmail(String email);
}
