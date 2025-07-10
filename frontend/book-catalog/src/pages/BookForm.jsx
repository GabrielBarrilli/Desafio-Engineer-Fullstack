import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, number, date } from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, getBookById, updateBook } from '../api';
import { toast } from 'react-toastify';
import axios from 'axios';

const schema = object({
  titulo:            string().required('Título é obrigatório'),
  autor:             string().required('Autor é obrigatório'),
  isbn:              string().required('ISBN é obrigatório'),
  dataPublicacao:    date().typeError('Data inválida').required('Data é obrigatória'),
  quantidadeEstoque: number().integer().positive().required('Estoque é obrigatório'),
  preco:             number().positive().required('Preço é obrigatório'),
});

export default function BookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getBookById(id)
      .then(({ data }) => {
        setValue('titulo',            data.titulo);
        setValue('autor',             data.autor);
        setValue('isbn',              data.isbn);
        setValue('dataPublicacao',    data.dataPublicacao);
        setValue('quantidadeEstoque', data.quantidadeEstoque);
        setValue('preco',             data.preco);
      })
      .catch(() => toast.error('Falha ao carregar livro.'))
      .finally(() => setLoading(false));
  }, [id, isEdit, setValue]);

  const isbnValue = watch('isbn');

  useEffect(() => {
    if (!isbnValue) return;

    const cleanIsbn = isbnValue.replace(/\D/g, '');
    if (!/^\d{10}(\d{3})?$/.test(cleanIsbn)) return;

    const controller = new AbortController();

    const fetchBook = async () => {
      try {
        const { data } = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`,
          { signal: controller.signal }
        );

        const item = data.items?.[0];
        if (!item) {
          toast.info('ISBN não encontrado na Google Books');
          return;
        }

        const info = item.volumeInfo;
        if (!watch('titulo') && info.title) setValue('titulo', info.title);
        if (!watch('autor') && info.authors?.length)
          setValue('autor', info.authors[0]);

        if (!watch('dataPublicacao') && info.publishedDate) {
          const parts = info.publishedDate.split('-');
          const iso =
            parts.length === 1
              ? `${parts[0]}-01-01`
              : parts.length === 2
              ? `${parts[0]}-${parts[1]}-01`
              : info.publishedDate;
          setValue('dataPublicacao', iso);
        }

        toast.success('Dados do livro importados!');
      } catch (err) {
        if (!axios.isCancel(err)) toast.error('Erro ao buscar ISBN');
      }
    };

    fetchBook();
    return () => controller.abort();
  }, [isbnValue, setValue, watch]);

  const onSubmit = async (payload) => {
    try {
      isEdit ? await updateBook(id, payload) : await createBook(payload);
      toast.success('Livro salvo com sucesso!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar livro.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? 'Editar Livro' : 'Novo Livro'}
      </h1>

      {loading ? (
        <p>Carregando…</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">ISBN *</label>
            <input
              {...register('isbn')}
              className="w-full bg-slate-800 border border-slate-600 p-2 rounded"
            />
            {errors.isbn && (
              <p className="text-red-600 text-sm">{errors.isbn.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Título *</label>
            <input
              {...register('titulo')}
              className="w-full bg-slate-800 border border-slate-600 p-2 rounded"
            />
            {errors.titulo && (
              <p className="text-red-600 text-sm">{errors.titulo.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Autor *</label>
            <input
              {...register('autor')}
              className="w-full bg-slate-800 border border-slate-600 p-2 rounded"
            />
            {errors.autor && (
              <p className="text-red-600 text-sm">{errors.autor.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Data de Publicação *</label>
            <input
              type="date"
              {...register('dataPublicacao')}
              className="w-full bg-slate-800 border border-slate-600 p-2 rounded"
            />
            {errors.dataPublicacao && (
              <p className="text-red-600 text-sm">
                {errors.dataPublicacao.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Quantidade em Estoque *</label>
            <input
              type="number"
              {...register('quantidadeEstoque')}
              className="w-full bg-slate-800 border border-slate-600 p-2 rounded"
            />
            {errors.quantidadeEstoque && (
              <p className="text-red-600 text-sm">
                {errors.quantidadeEstoque.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Preço (R$) *</label>
            <input
              type="number"
              step="0.01"
              {...register('preco')}
              className="w-full bg-slate-800 border border-slate-600 p-2 rounded"
            />
            {errors.preco && (
              <p className="text-red-600 text-sm">{errors.preco.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded"
          >
            Salvar
          </button>
        </form>
      )}
    </div>
  );
}
