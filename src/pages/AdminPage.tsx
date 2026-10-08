import { useState } from 'react';

function AdminPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Faça login antes de publicar produtos.');
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('description', form.description);
      payload.append('category', form.category);
      payload.append('price', form.price);
      payload.append('stock', form.stock);
      if (form.image) {
        payload.append('image', form.image);
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar produto');
      }

      setMessage('Produto cadastrado com sucesso.');
      setForm({ name: '', description: '', category: '', price: '', stock: '', image: null });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl justify-center">
      <div className="w-full rounded-[28px] border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl shadow-black/40 backdrop-blur sm:p-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Painel administrativo</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Gerenciar catálogo</h1>
          <p className="mt-3 text-sm text-zinc-400">Publique novos produtos com um fluxo visual limpo, premium e organizado.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Nome do produto</label>
              <input
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-white outline-none ring-0 transition focus:border-amber-500 placeholder-zinc-500"
                placeholder="Ex: Ares X1"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Descrição</label>
              <textarea
                className="min-h-32 w-full rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-white outline-none ring-0 transition focus:border-amber-500 placeholder-zinc-500"
                placeholder="Descreva as características do produto"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Categoria</label>
              <input
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-white outline-none ring-0 transition focus:border-amber-500 placeholder-zinc-500"
                placeholder="Ex: Coleção"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Status</label>
              <input
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-white outline-none ring-0 transition focus:border-amber-500 placeholder-zinc-500"
                placeholder="Ex: Em estoque"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Preço</label>
                <input
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-white outline-none ring-0 transition focus:border-amber-500 placeholder-zinc-500"
                  placeholder="R$ 0,00"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Estoque</label>
                <input
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-white outline-none ring-0 transition focus:border-amber-500 placeholder-zinc-500"
                  placeholder="0"
                  type="number"
                  value={form.stock}
                  onChange={(event) => setForm({ ...form, stock: event.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
            <label className="mb-3 block text-sm font-medium text-zinc-300">Imagem do produto</label>
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-300 transition hover:border-amber-500 hover:text-white">
              <span>{form.image ? form.image.name : 'Escolher arquivo'}</span>
              <span className="rounded-full bg-amber-500 px-3 py-1.5 text-sm font-medium text-zinc-950">Upload</span>
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={(event) => setForm({ ...form, image: event.target.files?.[0] || null })}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-sm text-zinc-500">Seu catálogo ficará mais elegante e organizado.</p>
            <button
              className="rounded-full bg-amber-500 px-6 py-3 font-medium text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Publicando...' : 'Publicar produto'}
            </button>
          </div>
        </form>

        {message ? <p className="mt-6 text-sm text-amber-300">{message}</p> : null}
      </div>
    </div>
  );
}

export default AdminPage;
