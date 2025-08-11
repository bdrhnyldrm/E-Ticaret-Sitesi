package com.ecommerce.service.impl;

import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Yeni kullanıcı her zaman USER rolü ile başlar
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(Role.ROLE_USER))
                .build();

        userRepository.save(user);

        // Kullanıcının rollerini enum -> String olarak al
        Set<String> roleNames = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());

        return jwtUtil.generateToken(user.getEmail(), roleNames);
    }

    public String login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Veritabanındaki rollerini al
        Set<String> roleNames = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());

        return jwtUtil.generateToken(user.getEmail(), roleNames);
    }
}
