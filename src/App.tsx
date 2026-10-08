import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Admin from './pages/Admin';

const CART_STORAGE_KEY = 'premium-store-cart';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  imageUrl?: string;
  imagem?: string;
};
type CartItem = Product & { quantity: number };

const isAdmin = () => {
  const user = localStorage.getItem('user');
  if (!user) return false;
  try {
    const parsed = JSON.parse(user);
    return parsed.role === 'admin';
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAdmin() ? children : <Navigate to="/entrar" replace />;
};

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      return [];
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === product.name);

      if (existingItem) {
        return prevItems.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });

    setToastMessage(`${product.name} adicionado ao carrinho!`);
    window.setTimeout(() => setToastMessage(null), 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-[0.2em] text-amber-400">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-sm font-semibold text-amber-400">
              P
            </span>
            <span>Premium Store</span>
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm text-zinc-300">
            <Link to="/" className="transition hover:text-white">Início</Link>
            <Link to="/entrar" className="transition hover:text-white">Entrar</Link>
            <Link to="/cadastrar" className="transition hover:text-white">Cadastrar</Link>
            <Link to="/carrinho" className="transition hover:text-white">Carrinho</Link>
            <Link to="/admin" className="transition hover:text-white">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/cadastrar" element={<Register />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {toastMessage ? (
        <div className="fixed bottom-4 right-4 rounded-full border border-amber-500/40 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-300 shadow-lg shadow-black/30">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}

export default App;
