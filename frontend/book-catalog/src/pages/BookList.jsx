import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import Pagination from '../components/Pagination';
import { Button } from '../components/Button';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [meta, setMeta] = useState({ page: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();

  const titulo = params.get('titulo') || '';
  const autor = params.get('autor') || '';
  const page = Number(params.get('page') || 0);

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
    <section>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          value={titulo}
          onChange={(e) => changeParam('titulo', e.target.value)}
          placeholder="Filtrar por título"
          className="flex-1 min-w-[200px] bg-slate-800 border border-slate-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        <input
          value={autor}
          onChange={(e) => changeParam('autor', e.target.value)}
          placeholder="Filtrar por autor"
          className="flex-1 min-w-[200px] bg-slate-800 border border-slate-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        <Link to="/books/new" className="ml-auto">
          <Button>+ Novo Livro</Button>
        </Link>
      </div>

      {loading ? (
        <p>Carregando…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                {[
                  'Título',
                  'Autor',
                  'ISBN',
                  'Publicação',
                  'Estoque',
                  'Preço (R$)',
                  'Ações',
                ].map((h) => (
                  <th
                    key={h}
                    className="p-2 border border-slate-700 text-left font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&>*:nth-child(even)]:bg-slate-800">
              {books.map((b) => (
                <tr key={b.id}>
                  <td className="p-2 border border-slate-700">{b.titulo}</td>
                  <td className="p-2 border border-slate-700">{b.autor}</td>
                  <td className="p-2 border border-slate-700">{b.isbn}</td>
                  <td className="p-2 border border-slate-700">{b.dataPublicacao}</td>
                  <td className="p-2 border border-slate-700">{b.quantidadeEstoque}</td>
                  <td className="p-2 border border-slate-700">
                    {b.preco?.toFixed?.(2)}
                  </td>
                  <td className="p-2 border border-slate-700">
                    <div className="flex gap-2 justify-center">
                      <Link to={`/books/${b.id}`}>
                        <Button variant="link">Ver</Button>
                      </Link>
                      <Link to={`/books/${b.id}/edit`}>
                        <Button variant="warning">Editar</Button>
                      </Link>
                      <Button variant="danger" onClick={() => handleDelete(b.id)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(p) => changeParam('page', p)}
      />
    </section>
  );
}
