import { useState } from 'react';

type Product = { id: number; name: string; price: number; description: string; image: string };

function HomePage({ addToCart }: { addToCart: (product: Product) => void }) {
  const [products] = useState([
    { id: 1, name: 'Ares X1', price: 4899, description: 'Modelo premium com acabamento de alto nível.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Velis Pro', price: 3299, description: 'Performance refinada para uso diário.', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Nox Elite', price: 6199, description: 'Linha exclusiva para colecionistas experientes.', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Oracle Gold', price: 7500, description: 'Edição limitada com detalhes em ouro 24k.', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600' },
    { id: 5, name: 'Chrono Black', price: 3899, description: 'Design minimalista e caixa em titânio fosco.', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60' },
    { id: 6, name: 'Stella Carbon', price: 5400, description: 'Alta resistência com pulseira em fibra de carbono.', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&auto=format&fit=crop&q=60' },
    { id: 7, name: 'Vanguard Blue', price: 4650, description: 'Mostrador azul oceano com ponteiros luminosos.', image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=500&auto=format&fit=crop&q=60' },
    { id: 8, name: 'Apex Rose', price: 6800, description: 'Caixa refinada em ouro rosé e pulseira de couro.', image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=500&auto=format&fit=crop&q=60' },
    { id: 9, name: 'Titan Force', price: 5900, description: 'Construção militar blindada à prova de choques.', image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=500&auto=format&fit=crop&q=60' },
    { id: 10, name: 'Overlord Silver', price: 3100, description: 'Aço inoxidável polido com linhas tradicionais.', image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=500&auto=format&fit=crop&q=60' },
    { id: 11, name: 'Phantom Ghost', price: 8200, description: 'Mecanismo esqueleto com fundo transparente.', image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500&auto=format&fit=crop&q=60' },
    { id: 12, name: 'Zephyr Sport', price: 2990, description: 'Cronógrafo esportivo com alta precisão lateral.', image: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=500&auto=format&fit=crop&q=60' }
  ]);

  const handleAddToCart = (product: Product) => addToCart(product);

  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl shadow-black/30 lg:p-12">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-400">Coleção premium</p>
        <h1 className="max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
          Design sofisticado, experiência impecável e produtos selecionados.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-zinc-400">
          Uma plataforma elegante para quem busca confiança, velocidade e excelência em cada detalhe.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="/cadastrar" className="rounded-full bg-amber-500 px-6 py-3 font-medium text-zinc-950 transition hover:bg-amber-400">
            Criar conta
          </a>
          <a href="/carrinho" className="rounded-full border border-zinc-700 px-6 py-3 font-medium text-zinc-200 transition hover:border-amber-400 hover:text-white">
            Ver carrinho
          </a>
        </div>
      </div>

      <div className="py-10 md:py-16">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Novidades em destaque</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Seleção premium para o seu estilo</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-[#121212] border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between h-[420px]">
              <div>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{product.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-zinc-900">
                <span className="text-xl font-bold text-[#facc15]">
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-zinc-900 border border-zinc-700 hover:bg-[#facc15] hover:text-black transition-all px-4 py-2 rounded-full text-sm text-white font-medium"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
