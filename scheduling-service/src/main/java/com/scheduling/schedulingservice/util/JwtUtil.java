package com.scheduling.schedulingservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${sch.secret.jwt-secret}")
    private String secretKeyString;

    private SecretKey getSecretKey() {
        // Fallback for short keys (HS256 requires 256-bit / 32-byte keys)
        // If the key is shorter, pad it so it doesn't crash JJWT 0.12
        String paddedKey = secretKeyString;
        while (paddedKey.length() < 32) {
            paddedKey += "0";
        }
        return Keys.hmacShaKeyFor(paddedKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserDetails userDetails){
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() +  1000 * 300L))
                .signWith(getSecretKey())
                .compact();
    }

    public Claims extractClaim(String token){
        return Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token).getPayload();
    }

    public String getUsername(String token){
        return extractClaim(token).getSubject();
    }

    public Date extractExpiry(String token) {
        return extractClaim(token).getExpiration();
    }

    public boolean isExpiredToken(String token){
        return extractExpiry(token).before(new Date());
    }

    public boolean isTokenValid(String token, UserDetails userDetails){
        return userDetails.getUsername().equals(getUsername(token)) && !isExpiredToken(token);
    }



}
