package com.barrilli.backend.service;

import com.barrilli.backend.exception.LivroNotFoundException;
import com.barrilli.backend.mapper.LivroMapper;
import com.barrilli.backend.model.Livro;
import com.barrilli.backend.model.request.SalvarLivroRequest;
import com.barrilli.backend.model.response.LivroResponse;
import com.barrilli.backend.repository.LivroRepository;
import com.barrilli.backend.util.LivroSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final LivroRepository livroRepository;

    public Page<LivroResponse> listar(String titulo, String autor, Pageable pageable) {
        Specification<Livro> spec = Specification.where(LivroSpec.tituloLike(titulo))
                .and(LivroSpec.autorLike(autor));

        return livroRepository.findAll(spec, pageable)
                .map(LivroMapper::toResponse);
    }

    public LivroResponse findById(Long id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new LivroNotFoundException(id));
        return LivroMapper.toResponse(livro);
    }

    public void criar(SalvarLivroRequest request) {
        if (livroRepository.existsByIsbn(request.isbn())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "ISBN já cadastrado.");
        }

        Livro livro = LivroMapper.toEntity(request);
        LivroMapper.toResponse(livroRepository.save(livro));
    }

    public LivroResponse atualizar(Long id, SalvarLivroRequest request) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new LivroNotFoundException(id));

        livro.setTitulo(request.titulo());
        livro.setAutor(request.autor());
        livro.setIsbn(request.isbn());
        livro.setDataPublicacao(request.dataPublicacao());
        livro.setQuantidadeEstoque(request.quantidadeEstoque());
        livro.setPreco(request.preco());

        return LivroMapper.toResponse(livroRepository.save(livro));
    }

    public void deletar(Long id) {
        if (!livroRepository.existsById(id)) {
            throw new LivroNotFoundException(id);
        }
        livroRepository.deleteById(id);
    }
}