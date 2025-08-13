package com.ecommerce.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtUtil {

    // DİKKAT: Üretimde çevre değişkeninden oku ve 256+ bit uzun tut.
    private static final String SECRET = "change-this-secret-to-a-very-long-256-bit-string-xyz1234567890-change-it";
    // Token süresi (ör. 24 saat)
    private static final long EXP_MS = 1000L * 60 * 60 * 24;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = parseClaims(token);
        return resolver.apply(claims);
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // AuthenticationService'de kullanılıyor: email + roller
    public String generateToken(String subject, Set<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles == null ? Collections.emptyList() : roles);

        Date now = new Date();
        Date exp = new Date(now.getTime() + EXP_MS);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // JwtAuthFilter içinde tek parametre ile çağrılıyor
    public boolean isTokenValid(String token) {
        try {
            // İmza/format kontrolü başarısızsa parseClaims() exception fırlatır
            parseClaims(token);
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Date exp = extractClaim(token, Claims::getExpiration);
        return exp != null && exp.before(new Date());
    }
}
