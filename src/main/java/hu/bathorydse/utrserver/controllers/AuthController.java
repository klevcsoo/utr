package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.models.ERole;
import hu.bathorydse.utrserver.models.Role;
import hu.bathorydse.utrserver.models.User;
import hu.bathorydse.utrserver.payload.request.LoginRequest;
import hu.bathorydse.utrserver.payload.request.NewUserRequest;
import hu.bathorydse.utrserver.payload.response.JwtResponse;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.RoleRepository;
import hu.bathorydse.utrserver.repository.UserRepository;
import hu.bathorydse.utrserver.security.jwt.JwtUtils;
import hu.bathorydse.utrserver.security.services.UserDetailsImpl;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(
        @Valid @RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(),
                request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication
            .getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        return ResponseEntity.ok(
            new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
                userDetails.getDisplayName(), roles));
    }

    @PostMapping("/new-user")
    public ResponseEntity<?> registerUser(
        @Valid @RequestBody NewUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Create new user's account
        User user = new User(request.getUsername(),
            request.getDisplayName(),
            encoder.encode(request.getPassword()));

        Set<String> strRoles = request.getRole();
        Set<Role> roles = new HashSet<>();

        strRoles.forEach(role -> {
            switch (role) {
                case "admin": {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException(
                            "Error: Role is not found."));
                    roles.add(adminRole);

                    break;
                }
                case "idorogzito": {
                    Role idorogzitoRole = roleRepository.findByName(
                        ERole.ROLE_IDOROGZITO).orElseThrow(
                        () -> new RuntimeException(
                            "Error: Role is not found."));
                    roles.add(idorogzitoRole);

                    break;
                }
                case "allitobiro": {
                    Role allitobiroRole = roleRepository.findByName(
                        ERole.ROLE_ALLITOBIRO).orElseThrow(
                        () -> new RuntimeException(
                            "Error: Role is not found."));
                    roles.add(allitobiroRole);

                    break;
                }
                default: {
                    Role userRole = roleRepository.findByName(
                        ERole.ROLE_SPEAKER).orElseThrow(
                        () -> new RuntimeException(
                            "Error: Role is not found."));
                    roles.add(userRole);
                }
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(
            new MessageResponse("User registered successfully!"));
    }
}
