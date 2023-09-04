package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.domain.Address;
import hr.tvz.tkalec.tastily.dto.AddressDTO;
import hr.tvz.tkalec.tastily.repository.AddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService{

    private final AddressRepository addressRepository;

    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    public List<AddressDTO> findAll() {
        return addressRepository.findAll().stream().map(this::mapAddressToDTO).collect(Collectors.toList());
    }

    public AddressDTO mapAddressToDTO(final Address address) {
        return new AddressDTO(address.getId(), address.getStreetName(), address.getLatitude(), address.getLongitude());
    }
}
