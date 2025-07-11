package com.barrilli.backend.service;

import com.barrilli.backend.model.request.SalvarLivroRequest;
import com.barrilli.backend.model.response.LivroResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Testcontainers
@SpringBootTest
class LivroServiceIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("livraria")
            .withUsername("livraria")
            .withPassword("root");

    @DynamicPropertySource
    static void datasourceProps(DynamicPropertyRegistry reg) {
        reg.add("spring.datasource.url", postgres::getJdbcUrl);
        reg.add("spring.datasource.username", postgres::getUsername);
        reg.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private LivroService service;

    @Test
    void fluxoCompleto_create_find_list_delete() {
        SalvarLivroRequest req = new SalvarLivroRequest(
                "Clean Code", "Robert C. Martin", "9780132350884",
                LocalDate.of(2008, 8, 1), 5, 99.90);

        service.criar(req);

        Page<LivroResponse> page = service.listar("Clean", "", Pageable.unpaged());
        assertThat(page.getContent()).hasSize(1);

        Long id = page.getContent().getFirst().id();

        LivroResponse res = service.findById(id);
        assertThat(res.autor()).isEqualTo("Robert C. Martin");

        service.deletar(id);
        assertThatThrownBy(() -> service.findById(id))
                .hasMessageContaining("Livro com ID " + id + " não encontrado");
    }
}
