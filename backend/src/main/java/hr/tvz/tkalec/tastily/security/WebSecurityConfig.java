package hr.tvz.tkalec.tastily.security;

import hr.tvz.tkalec.tastily.security.jwt.AuthEntryPointJwt;
import hr.tvz.tkalec.tastily.security.jwt.AuthTokenFilter;
import hr.tvz.tkalec.tastily.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.session.SessionManagementFilter;


@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsFilter corsFilter() {
        CorsFilter filter = new CorsFilter();
        return filter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .addFilterBefore(corsFilter(), SessionManagementFilter.class)
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers(HttpMethod.POST, "/item", "/item/").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/item/value/**").authenticated()

                                .requestMatchers(HttpMethod.GET, "/item/check-name/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "item/category/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/item", "/item/").permitAll()

                                .requestMatchers(HttpMethod.PUT, "/item/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/item/**").hasRole("ADMIN")

                                .requestMatchers(HttpMethod.GET, "/category", "/category/").permitAll()
                                .requestMatchers(HttpMethod.GET, "/category/check-name/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/category", "/category/").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,"/category/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT,  "/category/**").hasRole("ADMIN")

                                .requestMatchers(HttpMethod.GET, "/order", "/order/").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET,  "/order/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/order", "/order/").authenticated()
                                .requestMatchers(HttpMethod.PUT,  "/order/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,  "/order/**").hasRole("ADMIN")

                                .requestMatchers(HttpMethod.GET, "/order-status/**").permitAll()
                                .requestMatchers(HttpMethod.PUT, "/order-status/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/order-status/value/**").permitAll()

                                .requestMatchers(HttpMethod.GET,  "/order-details").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET,  "/order-details/order/**").authenticated()

                                .requestMatchers(HttpMethod.GET, "/address", "/address/").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/users", "/users/").hasRole("ADMIN")

                                .requestMatchers("/api/auth/**").permitAll()
                                .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }



}
