import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';

import BookList   from './pages/BookList';
import BookForm   from './pages/BookForm';
import BookDetail from './pages/BookDetail';

export default function App() {
  return (
    <BrowserRouter>
    <Layout>
      {}
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/books/new"     element={<BookForm />} />
        <Route path="/books/:id/edit" element={<BookForm />} />
        <Route path="/books/:id"      element={<BookDetail />} />
        <Route path="*" element={<p className="p-4">Página não encontrada</p>} />
      </Routes>

      {}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        draggable
      />
      </Layout>
    </BrowserRouter>
  );
}
