package com.barrilli.backend.service;

import com.barrilli.backend.exception.LivroNotFoundException;
import com.barrilli.backend.model.Livro;
import com.barrilli.backend.model.request.SalvarLivroRequest;
import com.barrilli.backend.model.response.LivroResponse;
import com.barrilli.backend.repository.LivroRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LivroServiceTest {

    @Mock
    private LivroRepository livroRepository;

    @InjectMocks
    private LivroService service;

    private Livro entity;
    private SalvarLivroRequest request;

    @BeforeEach
    void setUp() {
        entity = new Livro(1L, "Duna", "Frank Herbert", "978857657",
                LocalDate.of(1965, 8, 1), 10, 59.90);
        request = new SalvarLivroRequest("Duna", "Frank Herbert", "978857657",
                LocalDate.of(1965, 8, 1), 10, 59.90);
    }

    @Test
    void listar_deveRetornarPaginaMapeada() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("titulo"));
        Page<Livro> page  = new PageImpl<>(List.of(entity), pageable, 1);

        when(livroRepository.findAll(
                ArgumentMatchers.<Specification<Livro>>any(),
                eq(pageable))
        ).thenReturn(page);


        Page<LivroResponse> result = service.listar("Du", "Her", pageable);

        assertThat(result.getContent())
                .extracting(LivroResponse::titulo)
                .containsExactly("Duna");
    }

    @Test
    void findById_quandoExiste_retornaResponse() {
        when(livroRepository.findById(1L)).thenReturn(Optional.of(entity));

        LivroResponse res = service.findById(1L);

        assertThat(res.autor()).isEqualTo("Frank Herbert");
    }

    @Test
    void findById_quandoNaoExiste_lancaExcecao() {
        when(livroRepository.findById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(2L))
                .isInstanceOf(LivroNotFoundException.class);
    }

    @Test
    void criar_comIsbnDuplicado_deveLancarConflict() {
        when(livroRepository.existsByIsbn("978857657")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(request))
                .hasMessageContaining("ISBN já cadastrado");
    }

    @Test
    void criar_sucesso_gravaNoRepositorio() {
        when(livroRepository.existsByIsbn("978857657")).thenReturn(false);
        when(livroRepository.save(any(Livro.class))).thenReturn(entity);

        service.criar(request);

        verify(livroRepository).save(any(Livro.class));
    }

    @Test
    void atualizar_deveAlterarCamposEDevolverResponse() {
        when(livroRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(livroRepository.save(entity)).thenReturn(entity);

        SalvarLivroRequest novo = new SalvarLivroRequest(
                "Duna (Rev.)", "F. Herbert", "978857657",
                LocalDate.of(1965, 8, 1), 9, 60.00);

        LivroResponse res = service.atualizar(1L, novo);

        assertThat(res.titulo()).isEqualTo("Duna (Rev.)");
        verify(livroRepository).save(entity);
    }

    @Test
    void deletar_quandoExiste_remove() {
        when(livroRepository.existsById(1L)).thenReturn(true);

        service.deletar(1L);

        verify(livroRepository).deleteById(1L);
    }

    @Test
    void deletar_quandoNaoExiste_lancaExcecao() {
        when(livroRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.deletar(99L))
                .isInstanceOf(LivroNotFoundException.class);
    }
}
