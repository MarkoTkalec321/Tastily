package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.domain.User;
import hr.tvz.tkalec.tastily.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    //private Collection<? extends GrantedAuthority> authorities;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        return UserDetailsImpl.build(user);
    }

    @Override
    public List<UserDetailsImpl> findAll() {
        return userRepository.findAll().stream().map(this::mapUserDetailsImplToDTO).collect(Collectors.toList());
    }

    /*    @Override
    public List<CategoryDTO> findAll() {
        return categoryRepository.findAll().stream().map(this::mapCategoryToDTO).collect(Collectors.toList());
    }*/

    /*    private CategoryDTO mapCategoryToDTO(final Category category) {
        return new CategoryDTO(category.getId(), category.getName(), category.getDescription());
    }*/

    private UserDetailsImpl mapUserDetailsImplToDTO(final User user) {
/*        return new UserDetailsImpl(user.getId(),
                user.getUsername(),
                user.getFullname(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                user.getAddress().toAddressDTO());
    }*/
        return UserDetailsImpl.build(user);
    }
}
