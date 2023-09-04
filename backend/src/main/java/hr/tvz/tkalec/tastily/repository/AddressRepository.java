package hr.tvz.tkalec.tastily.repository;

import hr.tvz.tkalec.tastily.domain.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

}
