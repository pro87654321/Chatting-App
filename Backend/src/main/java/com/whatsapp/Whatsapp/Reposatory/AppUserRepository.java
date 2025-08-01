package com.whatsapp.Whatsapp.Reposatory;


import com.whatsapp.Whatsapp.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {


    @Query("SELECT u FROM AppUser u WHERE u.userName LIKE %:query% AND u.id <> :excludeId")
    List<AppUser> searchUsersByName(String query, Long excludeId);
    Optional<AppUser> findByEmail(String email);
    List<AppUser> findByIdNot(Long id);

    List<AppUser> findByUserNameContainingIgnoreCaseAndIdNot(String userName, Long id);
}
