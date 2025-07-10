import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BookList   from './pages/BookList';
import BookForm   from './pages/BookForm';
import BookDetail from './pages/BookDetail';

export default function App() {
  return (
    <BrowserRouter>
      {/* rotas */}
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/books/new"     element={<BookForm />} />
        <Route path="/books/:id/edit" element={<BookForm />} />
        <Route path="/books/:id"      element={<BookDetail />} />
        <Route path="*" element={<p className="p-4">Página não encontrada</p>} />
      </Routes>

      {/* container global – fica sempre presente */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        draggable
      />
    </BrowserRouter>
  );
}
