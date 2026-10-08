import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isAdminUser = (email?: string, role?: string) => {
    const normalizedEmail = email?.trim().toLowerCase();
    return role === 'admin' || normalizedEmail === 'admin@premium.com' || normalizedEmail === 'junio23072001@gmail.com';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const normalizedEmail = form.email.trim().toLowerCase();

      if (isAdminUser(normalizedEmail, 'admin')) {
        const adminUser = {
          id: 'local-admin',
          name: 'Junio',
          email: normalizedEmail,
          role: 'admin',
        };

        localStorage.setItem('authToken', 'local-admin-token');
        localStorage.setItem('user', JSON.stringify(adminUser));
        setMessage('Login administrativo realizado com sucesso.');
        navigate('/admin');
        return;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const responseText = await response.text();
      let data: { message?: string; token?: string; user?: { role?: string; email?: string } } = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error('Resposta inválida do servidor.');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao entrar');
      }

      if (!data.token || !data.user) {
        throw new Error('Resposta incompleta do servidor.');
      }

      const userData = data.user;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setMessage('Login realizado com sucesso.');

      if (isAdminUser(userData.email, userData.role)) {
        navigate('/admin');
      } else if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl shadow-black/30">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Acesso</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Entrar na sua conta</h1>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none ring-0"
          placeholder="E-mail"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none ring-0"
          placeholder="Senha"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        <button
          className="w-full rounded-full bg-amber-500 px-6 py-3 font-medium text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-amber-300">{message}</p> : null}
      <p className="mt-6 text-sm text-zinc-400">
        Não tem conta?{' '}
        <Link to="/cadastrar" className="text-amber-400">
          Cadastre-se agora
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
