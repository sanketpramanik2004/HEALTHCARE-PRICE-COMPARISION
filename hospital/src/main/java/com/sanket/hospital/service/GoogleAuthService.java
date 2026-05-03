package com.sanket.hospital.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.sanket.hospital.entity.User;
import com.sanket.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final GoogleIdTokenVerifier verifier;
    private final String googleClientId;

    public GoogleAuthService(
            UserRepository userRepository,
            @Value("${google.oauth.client-id:}") String googleClientId) {
        this.userRepository = userRepository;
        this.googleClientId = googleClientId == null ? "" : googleClientId.trim();
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(this.googleClientId.isBlank()
                        ? Collections.emptyList()
                        : Collections.singletonList(this.googleClientId))
                .build();
    }

    public User authenticate(String idTokenString) {
        if (googleClientId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Google sign-in is not configured yet.");
        }
        if (idTokenString == null || idTokenString.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google credential is required.");
        }

        GoogleIdToken idToken;
        try {
            idToken = verifier.verify(idTokenString);
        } catch (GeneralSecurityException | java.io.IOException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google sign-in verification failed.");
        }

        if (idToken == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google sign-in token.");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        Object emailVerified = payload.get("email_verified");
        if (!(emailVerified instanceof Boolean) || !((Boolean) emailVerified)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google email is not verified.");
        }

        String email = payload.getEmail();
        String fullName = (String) payload.get("name");

        User existing = userRepository.findByEmail(email);
        if (existing != null) {
            if (existing.getAuthProvider() == null || existing.getAuthProvider().isBlank()) {
                existing.setAuthProvider("GOOGLE");
                userRepository.save(existing);
            }
            return existing;
        }

        User user = new User();
        user.setEmail(email);
        user.setName(fullName == null || fullName.isBlank() ? email.substring(0, email.indexOf("@")) : fullName);
        user.setRole("USER");
        user.setAuthProvider("GOOGLE");
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        return userRepository.save(user);
    }
}
