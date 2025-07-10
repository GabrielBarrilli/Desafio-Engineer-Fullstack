package com.barrilli.backend.model.response;

import java.time.LocalDate;

public record LivroResponse(
        Long id,
        String titulo,
        String autor,
        String isbn,
        LocalDate dataPublicacao,
        int quantidadeEstoque,
        Double preco
) {
}
