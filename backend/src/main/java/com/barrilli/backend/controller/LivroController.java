package com.barrilli.backend.controller;

import com.barrilli.backend.model.Livro;
import com.barrilli.backend.model.request.SalvarLivroRequest;
import com.barrilli.backend.model.response.LivroResponse;
import com.barrilli.backend.service.LivroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/livros")
@RequiredArgsConstructor
public class LivroController {

    private final LivroService livroService;

    @GetMapping
    public Page<LivroResponse> listar(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String autor,
            @PageableDefault(size = 10, sort = "titulo") Pageable pageable) {
        return livroService.listar(titulo, autor, pageable);
    }

    @GetMapping("/buscar-por-id/{id}")
    public ResponseEntity<LivroResponse> findById(@PathVariable Long id) {
        LivroResponse livro = livroService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(livro);
    }

    @PostMapping
    public void criar(@RequestBody @Valid SalvarLivroRequest request) {
            livroService.criar(request);
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<LivroResponse> atualizar(@PathVariable Long id,
                                              @RequestBody @Valid SalvarLivroRequest request) {
        return ResponseEntity.ok(livroService.atualizar(id, request));
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        livroService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
