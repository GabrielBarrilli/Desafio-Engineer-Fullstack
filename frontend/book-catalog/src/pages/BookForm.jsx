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
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  /* -------------------------------------------------
     1. Carrega dados existentes para edição
  ------------------------------------------------- */
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
  }, [id]);

  /* -------------------------------------------------
     2. Auto-preenchimento via ISBN
  ------------------------------------------------- */
  const isbnValue = watch('isbn');

useEffect(() => {
  if (!isbnValue) return;

  // remove tudo que não for dígito
  const cleanIsbn = isbnValue.replace(/\D/g, '');

  // só busca se tiver 10 OU 13 dígitos
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

      // preenche apenas se os campos estiverem vazios
      if (!watch('titulo') && info.title) setValue('titulo', info.title);
      if (!watch('autor') && info.authors?.length)
        setValue('autor', info.authors[0]);

      if (!watch('dataPublicacao') && info.publishedDate) {
        // publishedDate pode vir como "yyyy" ou "yyyy-MM-dd"
        const parts = info.publishedDate.split('-');
        const iso =
          parts.length === 1
            ? `${parts[0]}-01-01`
            : parts.length === 2
            ? `${parts[0]}-${parts[1]}-01`
            : info.publishedDate;
        setValue('dataPublicacao', iso); // formato aceito pelo input date
      }

      toast.success('Dados do livro importados!');
    } catch (err) {
      if (!axios.isCancel(err)) toast.error('Erro ao buscar ISBN');
    }
  };

  fetchBook();
  return () => controller.abort();
}, [isbnValue]);

  /* -------------------------------------------------
     3. Submit
  ------------------------------------------------- */
  const onSubmit = async (payload) => {
    try {
      if (isEdit) {
        await updateBook(id, payload);
      } else {
        await createBook(payload);
      }
      toast.success('Livro salvo com sucesso!');
      navigate('/');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar livro.');
    }
  };

  /* -------------------------------------------------
     4. Render
  ------------------------------------------------- */
  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? 'Editar Livro' : 'Novo Livro'}
      </h1>

      {loading ? (
        <p>Carregando…</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ISBN primeiro para auto-preencher */}
          <div>
            <label className="block mb-1">ISBN *</label>
            <input {...register('isbn')} className="w-full border p-2 rounded" />
            {errors.isbn && <p className="text-red-600 text-sm">{errors.isbn.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Título *</label>
            <input {...register('titulo')} className="w-full border p-2 rounded" />
            {errors.titulo && <p className="text-red-600 text-sm">{errors.titulo.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Autor *</label>
            <input {...register('autor')} className="w-full border p-2 rounded" />
            {errors.autor && <p className="text-red-600 text-sm">{errors.autor.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Data de Publicação *</label>
            <input type="date" {...register('dataPublicacao')} className="w-full border p-2 rounded" />
            {errors.dataPublicacao && (
              <p className="text-red-600 text-sm">{errors.dataPublicacao.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Quantidade em Estoque *</label>
            <input type="number" {...register('quantidadeEstoque')} className="w-full border p-2 rounded" />
            {errors.quantidadeEstoque && (
              <p className="text-red-600 text-sm">{errors.quantidadeEstoque.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Preço (R$) *</label>
            <input type="number" step="0.01" {...register('preco')} className="w-full border p-2 rounded" />
            {errors.preco && <p className="text-red-600 text-sm">{errors.preco.message}</p>}
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Salvar
          </button>
        </form>
      )}
    </div>
  );
}
