package hr.tvz.tkalec.tastily.controller;

import hr.tvz.tkalec.tastily.domain.Authority;
import hr.tvz.tkalec.tastily.repository.AddressRepository;
import hr.tvz.tkalec.tastily.repository.AuthorityRepository;
import hr.tvz.tkalec.tastily.repository.UserRepository;
import hr.tvz.tkalec.tastily.security.jwt.JwtUtils;
import hr.tvz.tkalec.tastily.security.payload.request.SignupRequest;
import hr.tvz.tkalec.tastily.security.payload.response.JwtResponse;
import hr.tvz.tkalec.tastily.security.payload.request.LoginRequest;
import hr.tvz.tkalec.tastily.security.payload.response.MessageResponse;
import hr.tvz.tkalec.tastily.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import hr.tvz.tkalec.tastily.domain.User;
import hr.tvz.tkalec.tastily.domain.Address;

@RestController
@RequestMapping(value = {"/api/auth", "/api/auth/"})
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;


    @Autowired
    public AuthController(AuthenticationManager authenticationManager, AddressRepository addressRepository,
                          UserRepository userRepository, AuthorityRepository authorityRepository,
                          PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping(value = {"/signin", "/signin/"})
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> authoritiesList = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity
                .ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getFullname(), userDetails.getEmail(), authoritiesList, userDetails.getAddressDto()));
    }

    @PostMapping(value = {"/signup", "/signup/"})
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new address
        Address address = new Address(signUpRequest.getStreetName(), signUpRequest.getLatitude(), signUpRequest.getLongitude());
        addressRepository.save(address);

        // Create new user's account
        User user = new User(signUpRequest.getUsername(), signUpRequest.getFullname(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), address);

        Set<String> strAuthorities = signUpRequest.getAuthoritiesSet();
        Set<Authority> roles = new HashSet<>();

        if (strAuthorities == null) {
            Authority userAuthority = authorityRepository.findByAuthorityName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userAuthority);
        } else {
            strAuthorities.forEach(role -> {
                switch (role) {
                    case "admin":
                        Authority adminRole = authorityRepository.findByAuthorityName("ROLE_ADMIN")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    default:
                        Authority userRole = authorityRepository.findByAuthorityName("ROLE_USER")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setAuthoritiesSet(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
