package com.ecommerce.config;

import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createAdminUser() {
        return args -> {
            String email = "admin@site.com";

            if (userRepository.findByEmail(email).isEmpty()) {
                User admin = User.builder()
                        .username("Admin") // ✅ username alanını kullanıyoruz
                        .email(email)
                        .password(passwordEncoder.encode("123"))
                        .roles(Set.of(Role.ROLE_ADMIN)) // ✅ enum doğru kullanılıyor
                        .build();

                userRepository.save(admin);
                System.out.println("✅ Admin kullanıcısı oluşturuldu: " + email);
            }
        };
    }
}
