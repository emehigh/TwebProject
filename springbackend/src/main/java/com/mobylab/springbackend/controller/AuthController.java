package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.service.AuthService;
import com.mobylab.springbackend.service.MailService;
import com.mobylab.springbackend.service.dto.LoginDto;
import com.mobylab.springbackend.service.dto.LoginResponseDto;
import com.mobylab.springbackend.service.dto.RegisterDto;
import com.mobylab.springbackend.service.dto.ResponseWrapper;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.mobylab.springbackend.exception.InvalidTokenException;
import com.mobylab.springbackend.exception.UserNotFoundException;
import com.mobylab.springbackend.exception.InvalidCredentialsException;
import com.mobylab.springbackend.exception.InvalidInputException;
import com.mobylab.springbackend.exception.UserAlreadyExistsException;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private MailService mailService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @RequestMapping(path = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        try {
            logger.info("Request to register user {}", registerDto.getEmail());
            authService.register(registerDto);

            // Send email notification
            String emailSubject = "Account Created Successfully";
            String emailBody = "Dear " + registerDto.getUsername() + ",\n\n" +
                    "Your account has been created successfully. Welcome to our platform!\n\n" +
                    "Best regards,\nThe Team";
            mailService.sendEmail(registerDto.getEmail(), emailSubject, emailBody);

            logger.info("Successfully registered user {} and sent confirmation email", registerDto.getEmail());
            return new ResponseEntity<>("User registered successfully. A confirmation email has been sent.", HttpStatus.CREATED);
        } catch (UserAlreadyExistsException e) {
            logger.error("User registration failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT); // 409 Conflict
        } catch (InvalidInputException e) {
            logger.error("Invalid input during registration: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400 Bad Request
        } catch (Exception e) {
            logger.error("Unexpected e  rror during registration: {}", e.getMessage());
            return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    @RequestMapping(path = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            logger.info("Request to login for user {}", loginDto.getEmail());
            String token = authService.login(loginDto);
            long expire = authService.getTokenTtl();

            LoginResponseDto responseDto = new LoginResponseDto()
                    .setToken(token)
                    .setExpire(expire);

            ResponseWrapper<LoginResponseDto> wrapper = new ResponseWrapper<>(responseDto);

            logger.info("Successfully logged in user {}", loginDto.getEmail());
            return new ResponseEntity<>(wrapper, HttpStatus.OK);
        } catch (InvalidCredentialsException e) {
            logger.error("Login failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        } catch (UserNotFoundException e) {
            logger.error("User not found: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND); // 404 Not Found
        } catch (Exception e) {
            logger.error("Unexpected error during login: {}", e.getMessage());
            return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @RequestMapping(path = "/token", method = RequestMethod.GET)
    public ResponseEntity<?> validateToken() {
        try {
            UserDetails user = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            logger.info("Request to validate token for user {}", user.getUsername());
            String email = user.getUsername();
            logger.info("Successfully validated token for user {}", user.getUsername());
            return new ResponseEntity<>(email, HttpStatus.OK);
        } catch (InvalidTokenException e) {
            logger.error("Token validation failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        } catch (Exception e) {
            logger.error("Unexpected error during token validation: {}", e.getMessage());
            return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
}