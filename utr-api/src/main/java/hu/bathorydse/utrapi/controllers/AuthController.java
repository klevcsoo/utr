package hu.bathorydse.utrapi.controllers;

import hu.bathorydse.utrapi.models.auth.ERole;
import hu.bathorydse.utrapi.models.auth.Role;
import hu.bathorydse.utrapi.models.auth.User;
import hu.bathorydse.utrapi.payload.request.ChangePasswordRequest;
import hu.bathorydse.utrapi.payload.request.LoginRequest;
import hu.bathorydse.utrapi.payload.request.NewUserRequest;
import hu.bathorydse.utrapi.payload.response.JwtResponse;
import hu.bathorydse.utrapi.payload.response.MessageResponse;
import hu.bathorydse.utrapi.repository.RoleRepository;
import hu.bathorydse.utrapi.repository.UserRepository;
import hu.bathorydse.utrapi.security.jwt.JwtUtils;
import hu.bathorydse.utrapi.security.services.UserDetailsImpl;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 3600)
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
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority).collect(Collectors.toList());

        return ResponseEntity.ok(
            new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
                userDetails.getDisplayName(), roles));
    }

    @PostMapping("/new-user")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody NewUserRequest request,
        Authentication authentication) {
        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        // If an admin user exists but the user is not admin return with an error.
        // The reason for that, is that if there are no admins to create other users,
        // the system needs to allow the first admin to be created somehow; and
        // the system administrator can do that by manually making a request.
        boolean existsAdmin = userRepository.existsByRolesContaining(adminRole);
        boolean isUserAdmin = authentication != null && authentication.getAuthorities()
            .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        if (existsAdmin && !isUserAdmin) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Insufficient authority."));
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Create new user's account
        User user = new User(request.getUsername(), request.getDisplayName(),
            encoder.encode(request.getPassword()));

        Set<String> strRoles = request.getRole();
        Set<Role> roles = new HashSet<>();

        strRoles.forEach(role -> {
            switch (role) {
                case "admin": {
                    roles.add(adminRole);

                    break;
                }
                case "idorogzito": {
                    Role idorogzitoRole = roleRepository.findByName(ERole.ROLE_IDOROGZITO)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(idorogzitoRole);

                    break;
                }
                case "allitobiro": {
                    Role allitobiroRole = roleRepository.findByName(ERole.ROLE_ALLITOBIRO)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(allitobiroRole);

                    break;
                }
                default: {
                    Role userRole = roleRepository.findByName(ERole.ROLE_SPEAKER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(
            new MessageResponse("User registered successfully! ID: " + user.getId()));
    }
}
