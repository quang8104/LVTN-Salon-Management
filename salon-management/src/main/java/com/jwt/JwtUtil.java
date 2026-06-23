package com.jwt;

import java.util.Date;

import io.jsonwebtoken.Jwts;

public class JwtUtil {
    private static final String SECRET="1234567890123456789012345678901234567890";
    public static String generateToken(String email){
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                    new Date(
                        System.currentTimeMillis()
                        +86400000
                    )
                )
                .signWith(
                    io.jsonwebtoken.security.Keys.hmacShaKeyFor(
                        SECRET.getBytes()
                    )
                )
                .compact();
    }
}
