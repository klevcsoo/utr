package hu.bathorydse.utrapi.auth.controller;

import hu.bathorydse.utrapi.auth.model.ERole;
import hu.bathorydse.utrapi.auth.model.Role;
import hu.bathorydse.utrapi.auth.model.User;
import hu.bathorydse.utrapi.auth.repository.RoleRepository;
import hu.bathorydse.utrapi.auth.repository.UserRepository;
import hu.bathorydse.utrapi.auth.request.ChangePasswordRequest;
import hu.bathorydse.utrapi.auth.request.LoginRequest;
import hu.bathorydse.utrapi.auth.request.NewUserRequest;
import hu.bathorydse.utrapi.auth.response.UserPublicResponse;
import hu.bathorydse.utrapi.core.response.JwtResponse;
import hu.bathorydse.utrapi.core.response.MessageResponse;
import hu.bathorydse.utrapi.language.UtrMessageSource;
import hu.bathorydse.utrapi.security.jwt.JwtUtils;
import hu.bathorydse.utrapi.security.services.UserDetailsImpl;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 43200)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UtrMessageSource messageSource;

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

    @GetMapping("/users/")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserPublicResponse>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(UserPublicResponse::new)
            .collect(Collectors.toList()));
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserPublicResponse> getUser(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> ResponseEntity.ok(new UserPublicResponse(value)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/users/")
    public ResponseEntity<MessageResponse> createUser(@Valid @RequestBody NewUserRequest request,
        Authentication authentication, Locale locale) {
        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow(
            () -> new RuntimeException(messageSource.get(locale, "auth.error.role_not_found")));

        // If an admin user exists but the user is not admin return with an error.
        // The reason for that, is that if there are no admins to create other users,
        // the system needs to allow the first admin to be created somehow; and
        // the system administrator can do that by manually making a request.
        boolean existsAdmin = userRepository.existsByRolesContaining(adminRole);
        boolean isUserAdmin = authentication != null && authentication.getAuthorities()
            .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        if (existsAdmin && !isUserAdmin) {
            return ResponseEntity.badRequest().body(new MessageResponse(
                messageSource.get(locale, "auth.error.insufficient_authority")));
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse(messageSource.get(locale, "auth.error.username_taken")));
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
                        .orElseThrow(() -> new RuntimeException(
                            messageSource.get(locale, "auth.error.role_not_found")));
                    roles.add(idorogzitoRole);

                    break;
                }
                case "allitobiro": {
                    Role allitobiroRole = roleRepository.findByName(ERole.ROLE_ALLITOBIRO)
                        .orElseThrow(() -> new RuntimeException(
                            messageSource.get(locale, "auth.error.role_not_found")));
                    roles.add(allitobiroRole);

                    break;
                }
                default: {
                    Role userRole = roleRepository.findByName(ERole.ROLE_SPEAKER).orElseThrow(
                        () -> new RuntimeException(
                            messageSource.get(locale, "auth.error.role_not_found")));
                    roles.add(userRole);
                }
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse(
            messageSource.get(locale, "auth.user_registered", user.getUsername())));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long userId, Locale locale) {
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        userRepository.delete(user.get());
        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "auth.user_deleted")));
    }

    @PatchMapping("/users/{userId}/password")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> changeUserPassword(@PathVariable Long userId,
        @Valid @RequestBody ChangePasswordRequest request, Locale locale) {
        // Only the admin can change the password of a user, and that is intentional.
        // To avoid abuse, the old password is of course required to make the change.

        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.get().getUsername(),
                request.getOldPassword()));
        if (!authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(
                new MessageResponse(messageSource.get(locale, "auth.error.invalid_password")));
        }

        user.get().setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user.get());
        return ResponseEntity.ok(new MessageResponse(
            messageSource.get(locale, "auth.password_changed", user.get().getUsername())));
    }

    @PatchMapping("/users/{userId}/roles")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> changeUserRoles(@PathVariable Long userId,
        @RequestParam("role") List<String> roles, Locale locale) {
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Because of the perfection of React, we have to abort the request,
        // if the new roles are the same as the current ones to avoid
        // false audit reports. More info in issue #65.
        List<String> userRoles = new ArrayList<>(user.get().getRoles()).stream()
            .map(role -> role.getName().name()).collect(Collectors.toList());
        int diff = (int) roles.stream().filter(s -> !userRoles.contains(s)).count();
        if (diff == 0) {
            return ResponseEntity.ok(
                new MessageResponse(messageSource.get(locale, "auth.roles_not_changed")));
        }

        Map<String, Role> roleMap = new HashMap<>();
        roleMap.put("ROLE_ADMIN", roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow(
            () -> new RuntimeException(messageSource.get(locale, "auth.error.role_not_found"))));
        roleMap.put("ROLE_IDOROGZITO", roleRepository.findByName(ERole.ROLE_IDOROGZITO).orElseThrow(
            () -> new RuntimeException(messageSource.get(locale, "auth.error.role_not_found"))));
        roleMap.put("ROLE_ALLITOBIRO", roleRepository.findByName(ERole.ROLE_ALLITOBIRO).orElseThrow(
            () -> new RuntimeException(messageSource.get(locale, "auth.error.role_not_found"))));
        roleMap.put("ROLE_SPEAKER", roleRepository.findByName(ERole.ROLE_SPEAKER).orElseThrow(
            () -> new RuntimeException(messageSource.get(locale, "auth.error.role_not_found"))));

        Set<Role> roleSet = new HashSet<>();
        for (String role : roles) {
            if (roleMap.containsKey(role)) {
                roleSet.add(roleMap.get(role));
            }
        }

        user.get().setRoles(roleSet);
        userRepository.save(user.get());
        return ResponseEntity.ok(new MessageResponse(
            messageSource.get(locale, "auth.roles_changed", user.get().getUsername())));
    }

    @PatchMapping("/users/{userId}/display-name")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> changeUserDisplayName(@PathVariable Long userId,
        @RequestParam String displayName, Locale locale) {
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        user.get().setDisplayName(displayName);
        userRepository.save(user.get());
        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "auth.display_name_changed")));
    }
}
