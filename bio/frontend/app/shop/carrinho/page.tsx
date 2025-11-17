"use client";
import { useCart } from "@/store/cart";
import Link from "next/link";

export default function CarrinhoPage() {
  const { items, remove } = useCart();
  const total = items.reduce((acc, i) => acc + i.priceCents * i.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Seu Carrinho</h1>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between items-center border-b pb-2">
              <div>
                <p>{i.name}</p>
                <p className="text-sm text-neutral-400">x{i.quantity}</p>
              </div>
              <div>
                <p>R$ {(i.priceCents * i.quantity / 100).toFixed(2)}</p>
                <button
                  onClick={() => remove(i.productId)}
                  className="text-red-400 hover:underline text-sm"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>R$ {(total / 100).toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="block mt-4 bg-green-600 hover:bg-green-700 text-white text-center rounded p-2"
          >
            Finalizar Compra
          </Link>
        </div>
      )}
    </div>
  );
}
