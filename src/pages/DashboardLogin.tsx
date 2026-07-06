import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLogin() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name.trim());
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-lg"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-xl bg-amber-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-extrabold">LC</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Fala<span className="text-amber-500">Librelon</span>
          </h1>
          <p className="text-zinc-500 mt-2">Acesso do atendente</p>
        </div>

        <input
          className="w-full h-12 px-4 rounded-xl bg-zinc-100 text-zinc-900 text-base outline-none"
          placeholder="Seu nome"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full h-12 mt-4 rounded-xl font-bold text-base text-white disabled:opacity-50"
          style={{ backgroundColor: name.trim() ? '#0047AB' : '#e4e4e7' }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
