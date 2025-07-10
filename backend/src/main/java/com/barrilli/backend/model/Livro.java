package com.barrilli.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column
    private String titulo;

    @NotBlank
    @Column
    private String autor;

    @NotBlank
    @Column
    private String isbn;

    @Column
    private LocalDate dataPublicacao;

    @Column
    private int quantidadeEstoque;

    @Column
    private Double preco;
}
