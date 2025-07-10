package com.barrilli.backend.exception;

public class LivroNotFoundException extends RuntimeException {
    public LivroNotFoundException(Long id) {
        super("Livro com ID " + id + " não encontrado.");
    }
}
