package com.example.expensetracker.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    // In a real app this should be externalised and strong
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long expirationMs = 30L * 24 * 60 * 60 * 1000; // 30 days

    public String generateToken(Long userId, boolean isGuest) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("isGuest", isGuest);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userId.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    public Long extractUserId(String token) {
        return Long.valueOf(Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject());
    }

    public boolean isGuest(String token) {
        Object val = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("isGuest");
        return Boolean.TRUE.equals(val);
    }
}
