package com.g4.backend.service;

import com.g4.backend.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.function.Function;
@Component
public class JwtService {

    public static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";
    private final HashSet<String> blacklistedTokens;
    private final AuthService authService;

    @Autowired
    public JwtService(HashSet<String> blacklistedTokens, AuthService authService) {
        this.blacklistedTokens = blacklistedTokens;
        this.authService = authService;
    }

    // Generate JWT based on the username
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        com.g4.backend.model.User user = authService.findUserByUsername(username);
        claims.put("role", user.getSetting().getName());
        claims.put("userId", user.getUserId());
        return createToken(claims, username);
    }

    // Create JWT with selected claims
    private String createToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 60 * 1000)) // JWT expiration time
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Get secret key for signing JWT
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Extract all claims from JWT
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Extract specific claim from JWT
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extract expiration date from JWT
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract username from JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Check if JWT has expired
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Validate JWT
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            if (blacklistedTokens.contains(token)) {
                return false;
            }
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT is expired: " + e.getMessage());
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT: " + e.getMessage());
        }
    }

    // Refresh JWT
    public String refreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        User user = authService.findUserByUsername(userDetails.getUsername());
        return createToken(claims, userDetails.getUsername());
    }

    // Invalidate JWT by adding it to the blacklist
    public boolean invalidateToken(String token) {
        return blacklistedTokens.add(token);
    }
}

