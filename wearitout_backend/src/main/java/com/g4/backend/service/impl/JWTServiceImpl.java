package com.g4.backend.service.impl;


import com.g4.backend.model.enity.User;
import com.g4.backend.service.AuthService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.function.Function;


@Component
public class JWTServiceImpl {
    public static final String SERECT = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";
    private HashSet<String> blacklistedTokens = new HashSet<>();
    private final AuthService userCustomerServices;

    @Autowired
    public JWTServiceImpl(HashSet<String> blacklistedTokens, AuthService userCustomerServices) {
        this.blacklistedTokens = blacklistedTokens;
        this.userCustomerServices = userCustomerServices;
    }

    // Tạo JWT dựa trên tên đang nhập
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        User user = userCustomerServices.findUserByUsername(username);
        claims.put("role", userCustomerServices.getRoles(user));
        claims.put("userId", user.getUserId());
        return createToken(claims, username);
    }

    // Tạo JWT với các claim đã chọn
    private String createToken(Map<String, Object> claims, String tenDangNhap) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(tenDangNhap)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 3 * 60 * 60 * 1000))
                .signWith(SignatureAlgorithm.HS256, getSigneKey())
                .compact();
    }

    // Lấy serect key
    private Key getSigneKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SERECT);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Trích xuất thông tin
    private Claims extractAllClaims(String token) {

        return  Jwts.parser().setSigningKey(getSigneKey()).parseClaimsJws(token).getBody();
    }

    // Trích xuất thông tin cho 1 claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    // Kiểm tra tời gian hết hạn từ JWT
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Kiểm tra tời gian hết hạn từ JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Kiểm tra cái JWT đã hết hạn
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Kiểm tra tính hợp lệ
    public boolean validateToken(String token, UserDetails userDetails) {
//        try {
            final String username = extractUsername(token);
            if (blacklistedTokens.contains(token)) {
                return false;
            }
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//        } catch (ExpiredJwtException e) {
//            throw new AppException(ErrorCode.TokenExpired);
//        } catch (JwtException e) {
//            throw new AppException(ErrorCode.TokenExpired);
//        }
    }


    public String refreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        User user = userCustomerServices.findUserByUsername(userDetails.getUsername());
        return createToken(claims, userDetails.getUsername());
    }

    public boolean invalidateToken(String token) {
        return blacklistedTokens.add(token);
    }
}
