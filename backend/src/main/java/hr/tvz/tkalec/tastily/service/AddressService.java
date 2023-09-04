package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.dto.AddressDTO;

import java.util.List;

public interface AddressService {

    List<AddressDTO> findAll();
}
