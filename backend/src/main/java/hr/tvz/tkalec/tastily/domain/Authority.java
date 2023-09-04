package hr.tvz.tkalec.tastily.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "authorities")
public class Authority implements Serializable {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name = "authority_name", nullable = false, length = 50)
    private String authorityName;

    @ManyToMany(targetEntity = User.class, mappedBy = "authoritiesSet")
    private List<User> userList;
}
