import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (form.password !== form.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const user = {
        id: 'local-admin',
        name: form.name.trim(),
        email: form.email.trim().toLowerCase() || 'junio23072001@gmail.com',
        role: 'admin',
      };

      localStorage.setItem('authToken', 'local-admin-token');
      localStorage.setItem('user', JSON.stringify(user));
      setMessage('Conta criada com sucesso.');
      navigate('/admin');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl shadow-black/30">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Cadastro</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Criar nova conta</h1>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none ring-0"
          placeholder="Nome completo"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
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
        <input
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none ring-0"
          placeholder="Confirmar Senha"
          type="password"
          value={form.confirmPassword}
          onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
          required
        />
        <button
          className="w-full rounded-full bg-amber-500 px-6 py-3 font-medium text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-amber-300">{message}</p> : null}
      <p className="mt-6 text-sm text-zinc-400">
        Já possui conta?{' '}
        <Link to="/entrar" className="text-amber-400">
          Fazer login
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
