package com.barrilli.backend.model.request;

import java.time.LocalDate;

public record SalvarLivroRequest (
        String titulo,
        String autor,
        String isbn,
        LocalDate dataPublicacao,
        int quantidadeEstoque,
        Double preco
) {
}
