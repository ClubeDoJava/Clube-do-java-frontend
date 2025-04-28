package br.com.clubedojava.webstore.controller;

import br.com.clubedojava.webstore.dto.AddressDTO;
import br.com.clubedojava.webstore.dto.UserDTO;
import br.com.clubedojava.webstore.service.AddressService;
import br.com.clubedojava.webstore.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
// Adiciona imports necessários
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import br.com.clubedojava.webstore.model.User;
import br.com.clubedojava.webstore.mapper.UserMapper;

import java.util.Set;
// Removido import não utilizado
// import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    // Adiciona logger
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final AddressService addressService;

    /*
     * Método original comentado:
    @GetMapping("/me")
    public CompletableFuture<ResponseEntity<UserDTO>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.findByEmail(userDetails.getUsername())
                .thenApply(userOpt -> userOpt
                        .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build()));
    }
    */

    // Nova versão síncrona
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            log.warn("Tentativa de acesso a /api/users/me sem UserDetails autenticado.");
            return ResponseEntity.status(401).build(); // Ou 403, dependendo da semântica desejada
        }
        log.info("UserController: Acessando /api/users/me para usuário: {}", userDetails.getUsername());
        log.debug("UserController: Authorities do UserDetails injetado: {}", userDetails.getAuthorities());

        // Usa findByEmail e mapeia para DTO
        try {
            Optional<User> userOpt = userService.findByEmail(userDetails.getUsername());

            log.info("UserController: Resultado da busca por {}: {}", userDetails.getUsername(), userOpt.isPresent() ? "Encontrado" : "Não encontrado");

            return userOpt
                    .map(UserMapper::toDto) // Mapeia User para UserDTO
                    .map(userDTO -> {
                        log.info("UserController: Retornando UserDTO para {}", userDetails.getUsername());
                        return ResponseEntity.ok(userDTO);
                    })
                    .orElseGet(() -> {
                        log.warn("UserController: Usuário {} não encontrado no banco de dados.", userDetails.getUsername());
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            log.error("UserController: Erro ao buscar usuário {}: {}", userDetails.getUsername(), e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }


    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<UserDTO>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO,
// ...

} 