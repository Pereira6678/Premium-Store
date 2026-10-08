import { useEffect, useState } from 'react';

const CART_STORAGE_KEY = 'premium-store-cart';

type CartItem = {
  id: number;
  name: string;
  price: number | string;
  description: string;
  quantity: number;
  imagem?: string;
  image?: string;
  imageUrl?: string;
};

const getProductImage = (item: CartItem) => item.imagem || item.image || item.imageUrl || '';

const sanitizePrice = (price: number | string | undefined | null) => {
  if (typeof price === 'number') {
    return Number.isFinite(price) ? price : 0;
  }

  if (typeof price !== 'string') {
    return 0;
  }

  const normalizedPrice = price
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsedPrice = parseFloat(normalizedPrice);

  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
};

function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [etapa, setEtapa] = useState<'carrinho' | 'pagamento' | 'sucesso'>('carrinho');
  const [metodoSelecionado, setMetodoSelecionado] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  const [parcelas, setParcelas] = useState('1');

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart.filter(Boolean) : []);
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const safeCartItems = Array.isArray(cartItems) ? cartItems.filter(Boolean) : [];
  const total = safeCartItems.reduce((sum, item) => {
    const price = sanitizePrice(item?.price);
    const quantity = Number(item?.quantity ?? 0);

    return sum + price * (Number.isFinite(quantity) ? quantity : 0);
  }, 0);

  const valorParcela = total / Number(parcelas || 1);
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const parcelasOptions = Array.from({ length: 12 }, (_, index) => index + 1);

  const copiarParaAreaDeTransferencia = async (texto: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(texto);
      }
      alert('Código copiado para a área de transferência');
    } catch {
      alert('Não foi possível copiar o código');
    }
  };

  const handleConfirmarPagamento = () => {
    alert(`Pedido realizado com sucesso via ${metodoSelecionado}`);
    setCartItems([]);
    window.localStorage.removeItem(CART_STORAGE_KEY);
    setEtapa('sucesso');
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl shadow-black/30">
      {etapa === 'carrinho' ? (
        <>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Carrinho</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Itens selecionados</h1>
          <div className="mt-8 space-y-4">
            {isLoading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/60 p-6 text-center">
                <p className="text-center text-xl font-semibold text-amber-400">Seu carrinho está vazio</p>
              </div>
            ) : safeCartItems.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/60 p-6 text-center">
                <p className="text-center text-xl font-semibold text-amber-400">Seu carrinho está vazio</p>
              </div>
            ) : (
              safeCartItems.map((item) => {
                const unitPrice = sanitizePrice(item?.price);
                const quantity = Number(item?.quantity ?? 0);
                const safeQuantity = Number.isFinite(quantity) ? quantity : 0;
                const subtotal = unitPrice * safeQuantity;
                const thumbnail = getProductImage(item as CartItem);
                const itemName = item?.name || 'Produto';

                return (
                  <div key={itemName} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                    <div className="flex items-center gap-4">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={itemName}
                          className="h-16 w-16 rounded-xl border border-zinc-800 object-cover"
                        />
                      ) : null}
                      <div>
                        <h2 className="font-semibold text-white">{itemName}</h2>
                        <p className="text-sm text-zinc-400">Qtd: {safeQuantity}</p>
                      </div>
                    </div>
                    <div className="text-right text-amber-400">
                      <p>{unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                      {safeQuantity > 1 ? (
                        <p className="mt-1 text-sm font-semibold text-amber-400">
                          Subtotal: {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-8 border-t border-zinc-800 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-lg text-zinc-300">Total estimado</span>
              <span className="text-2xl font-semibold text-amber-400">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <button
              type="button"
              onClick={() => setEtapa('pagamento')}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 font-bold text-black transition hover:brightness-110"
            >
              Finalizar Compra
            </button>
          </div>
        </>
      ) : etapa === 'pagamento' ? (
        <div id="checkout-container" className="min-h-[520px] rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
          <button
            type="button"
            onClick={() => setEtapa('carrinho')}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-amber-500 transition hover:text-amber-400"
          >
            <span className="text-lg">←</span>
            <span>Voltar para o carrinho</span>
          </button>

          <h2 className="mb-6 text-2xl font-bold text-white">Forma de Pagamento</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setMetodoSelecionado('pix')}
              className={`cursor-pointer rounded-xl border p-4 text-left transition-all hover:-translate-y-1 hover:border-amber-500/70 hover:shadow-lg hover:shadow-amber-500/10 ${metodoSelecionado === 'pix' ? 'border-amber-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-900'}`}
            >
              <p className="text-lg font-semibold text-white">Pix</p>
              <p className="mt-1 text-sm text-zinc-400">Aprovação imediata (5% OFF)</p>
            </button>

            <button
              type="button"
              onClick={() => setMetodoSelecionado('cartao')}
              className={`cursor-pointer rounded-xl border p-4 text-left transition-all hover:-translate-y-1 hover:border-amber-500/70 hover:shadow-lg hover:shadow-amber-500/10 ${metodoSelecionado === 'cartao' ? 'border-amber-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-900'}`}
            >
              <p className="text-lg font-semibold text-white">Cartão de Crédito</p>
              <p className="mt-1 text-sm text-zinc-400">Até 12x sem juros</p>
            </button>

            <button
              type="button"
              onClick={() => setMetodoSelecionado('boleto')}
              className={`cursor-pointer rounded-xl border p-4 text-left transition-all hover:-translate-y-1 hover:border-amber-500/70 hover:shadow-lg hover:shadow-amber-500/10 ${metodoSelecionado === 'boleto' ? 'border-amber-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-900'}`}
            >
              <p className="text-lg font-semibold text-white">Boleto Bancário</p>
              <p className="mt-1 text-sm text-zinc-400">Processamento em até 3 dias</p>
            </button>
          </div>

          {metodoSelecionado === 'pix' && (
            <div className="mb-6 mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126360014BR.GOV.BCB.PIX0114LOJA%20PREMIUM"
                    alt="QR code Pix"
                    className="h-32 w-32 rounded-xl border border-zinc-800 object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-2 block text-sm text-zinc-400">Código Pix</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      readOnly
                      value="00020126360014BR.GOV.BCB.PIX0114LOJA PREMIUM52040000530398654041.005802BR5923PREMIUM STORE6009SAO PAULO62070503***6304"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-2 text-sm text-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={() => copiarParaAreaDeTransferencia('00020126360014BR.GOV.BCB.PIX0114LOJA PREMIUM52040000530398654041.005802BR5923PREMIUM STORE6009SAO PAULO62070503***6304')}
                      className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-400"
                    >
                      Copiar Código
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {metodoSelecionado === 'cartao' && (
            <div className="mb-6 mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-4">
                <label className="mb-2 block text-sm text-zinc-400">Parcelamento</label>
                <select
                  value={parcelas}
                  onChange={(event) => setParcelas(event.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white"
                >
                  {parcelasOptions.map((value) => {
                    const optionValue = String(value);
                    const selectedTotal = total / value;
                    return (
                      <option key={optionValue} value={optionValue}>
                        {optionValue}x de {formatCurrency(selectedTotal)} sem juros
                      </option>
                    );
                  })}
                </select>
                <p className="mt-2 text-sm text-zinc-500">
                  Total: {formatCurrency(total)} • Valor da parcela atual: {formatCurrency(total / Number(parcelas || 1))}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Número do Cartão</label>
                  <input className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white" placeholder="0000 0000 0000 0000" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Nome do Titular</label>
                  <input className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white" placeholder="Seu nome" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Validade (MM/AA)</label>
                  <input className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white" placeholder="MM/AA" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">CVV</label>
                  <input className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white" placeholder="123" />
                </div>
              </div>
            </div>
          )}

          {metodoSelecionado === 'boleto' && (
            <div className="mb-6 mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-4xl text-amber-400">
                  ㊀
                </div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-400">Linha digitável</p>
                  <p className="mt-2 rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-2 text-sm text-zinc-200">
                    34191.79001 01043.513184 91020.150008 7 90000000000000
                  </p>
                  <button
                    type="button"
                    onClick={() => copiarParaAreaDeTransferencia('34191.79001 01043.513184 91020.150008 7 90000000000000')}
                    className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-400"
                  >
                    Copiar Linha Digitável
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirmarPagamento}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 font-bold text-black transition hover:brightness-110"
          >
            Confirmar Pagamento
          </button>
        </div>
      ) : (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-zinc-950/70 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Pedido confirmado</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Obrigado por comprar conosco</h2>
          <p className="mt-3 max-w-md text-zinc-400">
            Seu pedido foi realizado com sucesso via {metodoSelecionado}.
          </p>
          <button
            type="button"
            onClick={() => setEtapa('carrinho')}
            className="mt-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 font-bold text-black transition hover:brightness-110"
          >
            Voltar ao carrinho
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
