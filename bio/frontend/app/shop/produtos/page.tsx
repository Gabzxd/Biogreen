"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "@/store/cart";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const { add } = useCart();

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog/products`).then((res) => {
      setProdutos(res.data.items);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produtos.map((p) => (
          <div key={p.id} className="bg-[#111936] p-4 rounded border border-[#1C2541]">
            <h2 className="text-lg font-medium">{p.name}</h2>
            <p className="text-sm text-neutral-400">{p.description}</p>
            <p className="mt-2 font-semibold">R$ {(p.priceCents / 100).toFixed(2)}</p>
            <button
              onClick={() =>
                add({ productId: p.id, name: p.name, priceCents: p.priceCents, quantity: 1 })
              }
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white rounded p-2"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}