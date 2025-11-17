// apps/web/app/(shop)/checkout/page.tsx
"use client";
import axios from "axios";
import { useCart } from "@/store/cart";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const total = items.reduce((acc, i) => acc + i.priceCents * i.quantity, 0);

  const createOrder = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/create-order`,
      { items: items.map(i => ({ productId: i.productId, quantity: i.quantity })) },
      { headers: { Authorization: `Bearer ${token}` } });
    return data.orderId;
  };

  const pay = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const orderId = await createOrder();
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create`, { orderId },
      { headers: { Authorization: `Bearer ${token}` } });
    window.location.href = data.init_point; // Pix, cartão e boleto
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Finalizar Compra</h1>
      <div className="mt-4 space-y-3">
        {items.map(i => (
          <div key={i.productId} className="flex justify-between border-b border-[#1C2541] pb-2">
            <span>{i.name} x{i.quantity}</span>
            <span>R$ {(i.priceCents * i.quantity / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>R$ {(total / 100).toFixed(2)}</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-neutral-400">Métodos aceitos: Pix, Cartão, Boleto (via Mercado Pago).</p>
      <button disabled={loading} onClick={pay} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white rounded p-2">
        Ir para Pagamento
      </button>
      <a href="/cart" className="mt-2 block text-sm text-green-400 hover:underline">Voltar para o carrinho</a>
    </div>
  );
}