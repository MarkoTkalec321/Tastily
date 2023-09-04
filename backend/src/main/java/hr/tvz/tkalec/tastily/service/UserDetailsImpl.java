package hr.tvz.tkalec.tastily.service;

import com.fasterxml.jackson.annotation.JsonIgnore;
import hr.tvz.tkalec.tastily.dto.AddressDTO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import hr.tvz.tkalec.tastily.domain.User;
public class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;

    private String fullname;
    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    private AddressDTO addressDTO;

    public UserDetailsImpl(Long id, String username, String fullname, String email, String password,
                           Collection<? extends GrantedAuthority> authorities, AddressDTO addressDTO) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.addressDTO = addressDTO;
    }
/*    public UserDetailsImpl(Long id, String username, String fullname, String email, String password,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
}*/

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getAuthoritiesSet().stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getAuthorityName()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(user.getId(),
                user.getUsername(),
                user.getFullname(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                user.getAddress().toAddressDTO());
    }

/*    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getAuthoritiesSet().stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getAuthorityName()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(user.getId(),
                user.getUsername(),
                user.getFullname(),
                user.getEmail(),
                user.getPassword(),
                authorities);
    }*/

    public AddressDTO getAddressDto(){
        return addressDTO;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public String getFullname(){
        return fullname;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
