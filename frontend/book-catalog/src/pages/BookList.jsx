import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import Pagination from '../components/Pagination';

export default function BookList() {
  const [books, setBooks]     = useState([]);
  const [meta, setMeta]       = useState({ page: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [params, setParams]   = useSearchParams();

  /* filtros */
  const titulo = params.get('titulo') || '';
  const autor  = params.get('autor')  || '';
  const page   = Number(params.get('page') || 0);

  /* carregar lista */
  useEffect(() => {
    setLoading(true);
    getBooks({ titulo, autor, page, size: 10 })
      .then(({ data }) => {
        setBooks(data.content);
        setMeta({ page: data.number, totalPages: data.totalPages });
      })
      .finally(() => setLoading(false));
  }, [titulo, autor, page]);

  const changeParam = (key, value) => {
    params.set(key, value);
    if (key !== 'page') params.set('page', 0);
    setParams(params);
  };

  const handleDelete = async (id) => {
    if (confirm('Confirmar exclusão?')) {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Catálogo de Livros</h1>

      {/* filtros */}
      <div className="flex gap-4 mb-4">
        <input
          value={titulo}
          onChange={(e) => changeParam('titulo', e.target.value)}
          placeholder="Filtrar por título"
          className="border p-2 rounded w-1/3"
        />
        <input
          value={autor}
          onChange={(e) => changeParam('autor', e.target.value)}
          placeholder="Filtrar por autor"
          className="border p-2 rounded w-1/3"
        />
        <Link to="/books/new" className="ml-auto bg-green-600 text-white px-4 py-2 rounded">
          + Novo Livro
        </Link>
      </div>

      {/* tabela */}
      {loading ? (
        <p>Carregando…</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Título</th>
              <th className="p-2 border">Autor</th>
              <th className="p-2 border">ISBN</th>
              <th className="p-2 border">Publicação</th>
              <th className="p-2 border">Estoque</th>
              <th className="p-2 border">Preço (R$)</th>
              <th className="p-2 border w-44">Ações</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className="text-center">
                <td className="p-2 border">{b.titulo}</td>
                <td className="p-2 border">{b.autor}</td>
                <td className="p-2 border">{b.isbn}</td>
                <td className="p-2 border">{b.dataPublicacao}</td>
                <td className="p-2 border">{b.quantidadeEstoque}</td>
                <td className="p-2 border">{b.preco?.toFixed?.(2)}</td>
                <td className="p-2 border">
                  <Link to={`/books/${b.id}`} className="px-2 text-blue-600 hover:underline">
                    Ver
                  </Link>
                  <Link to={`/books/${b.id}/edit`} className="px-2 text-yellow-600 hover:underline">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(b.id)} className="px-2 text-red-600">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(p) => changeParam('page', p)}
      />
    </div>
  );
}
