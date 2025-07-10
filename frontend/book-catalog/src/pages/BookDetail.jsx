import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBookById } from '../api';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    getBookById(id).then(({ data }) => setBook(data));
  }, [id]);

  if (!book) return <p className="p-4">Carregando…</p>;

  return (
    <div className="container mx-auto p-4 max-w-lg text-sm">
      <h1 className="text-2xl font-bold mb-4">{book.titulo}</h1>

      <p className="mb-1"><strong>Autor:</strong> {book.autor}</p>
      <p className="mb-1"><strong>ISBN:</strong> {book.isbn}</p>
      <p className="mb-1"><strong>Data de Publicação:</strong> {book.dataPublicacao}</p>
      <p className="mb-1"><strong>Quantidade em Estoque:</strong> {book.quantidadeEstoque}</p>
      <p className="mb-6"><strong>Preço:</strong> R$ {book.preco?.toFixed?.(2)}</p>

      <Link to={`/books/${book.id}/edit`} className="bg-yellow-600 text-white px-4 py-2 rounded mr-2">
        Editar
      </Link>
      <Link to="/" className="bg-gray-300 px-4 py-2 rounded">Voltar</Link>
    </div>
  );
}
