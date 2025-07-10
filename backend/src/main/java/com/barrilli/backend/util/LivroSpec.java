package com.barrilli.backend.util;

import com.barrilli.backend.model.Livro;
import org.springframework.data.jpa.domain.Specification;

public class LivroSpec {
    public static Specification<Livro> tituloLike(String titulo) {
        return (root, query, cb) ->
                titulo == null ? null : cb.like(cb.lower(root.get("titulo")), "%" + titulo.toLowerCase() + "%");
    }

    public static Specification<Livro> autorLike(String autor) {
        return (root, query, cb) ->
                autor == null ? null : cb.like(cb.lower(root.get("autor")), "%" + autor.toLowerCase() + "%");
    }
}
