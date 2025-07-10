import { Link } from 'react-router-dom';   
import monkey from '../assets/monkey.png';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="relative border-b border-slate-700">
        <Link
          to="/"                                  
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <img
            src={monkey}
            alt="Mascote macaco lendo – voltar à página inicial"
            className="w-12 h-12 hover:scale-105 transition-transform cursor-pointer"
          />
        </Link>

        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-semibold text-center">
            Livraria Barrilli
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
