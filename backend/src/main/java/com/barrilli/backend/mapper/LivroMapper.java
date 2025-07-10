package com.barrilli.backend.mapper;

import com.barrilli.backend.model.Livro;
import com.barrilli.backend.model.request.SalvarLivroRequest;
import com.barrilli.backend.model.response.LivroResponse;

public class LivroMapper {

    public static Livro toEntity(SalvarLivroRequest request) {
        if (request == null) return null;

        Livro livro = new Livro();
        livro.setTitulo(request.titulo());
        livro.setAutor(request.autor());
        livro.setIsbn(request.isbn());
        livro.setDataPublicacao(request.dataPublicacao());
        livro.setQuantidadeEstoque(request.quantidadeEstoque());
        livro.setPreco(request.preco());

        return livro;
    }

    public static LivroResponse toResponse(Livro livro) {
        if (livro == null) return null;

        return new LivroResponse(
                livro.getId(),
                livro.getTitulo(),
                livro.getAutor(),
                livro.getIsbn(),
                livro.getDataPublicacao(),
                livro.getQuantidadeEstoque(),
                livro.getPreco()
        );
    }
}
