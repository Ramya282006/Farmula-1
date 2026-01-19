import { useEffect, useState } from "react";
import {
  FaStore,
  FaShoppingCart,
  FaPlusCircle,
  FaSearch,
  FaBoxOpen,
  FaClipboardList,
  FaPaperPlane,
} from "react-icons/fa";

type SellItem = {
  id?: number;
  name: string;
  contact: string;
  product: string;
  quantity: string;
  price: string;
};

type BuyItem = {
  id?: number;
  name: string;
  contact: string;
  product: string;
  quantity: string;
};

export function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell");

  const [sellList, setSellList] = useState<SellItem[]>([]);
  const [buyList, setBuyList] = useState<BuyItem[]>([]);

  const [sellForm, setSellForm] = useState<SellItem>({
    name: "",
    contact: "",
    product: "",
    quantity: "",
    price: "",
  });

  const [buyForm, setBuyForm] = useState<BuyItem>({
    name: "",
    contact: "",
    product: "",
    quantity: "",
  });

  /* ---------------- FETCH EXISTING DATA ---------------- */

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/marketplace/sell")
      .then(res => res.json())
      .then(data => Array.isArray(data) && setSellList(data))
      .catch(() => { });

    fetch("http://127.0.0.1:8000/api/marketplace/buy")
      .then(res => res.json())
      .then(data => Array.isArray(data) && setBuyList(data))
      .catch(() => { });
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const addSellProduct = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/marketplace/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sellForm),
    });

    const saved = await res.json();
    setSellList([saved, ...sellList]);

    setSellForm({
      name: "",
      contact: "",
      product: "",
      quantity: "",
      price: "",
    });
  };

  const addBuyRequest = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/marketplace/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buyForm),
    });

    const saved = await res.json();
    setBuyList([saved, ...buyList]);

    setBuyForm({
      name: "",
      contact: "",
      product: "",
      quantity: "",
    });
  };

  /* ---------------- DELETE HANDLERS ---------------- */

  const deleteSellProduct = async (id?: number) => {
    if (!id) return;

    await fetch(`http://127.0.0.1:8000/api/marketplace/sell/${id}`, {
      method: "DELETE",
    });

    setSellList(prev => prev.filter(item => item.id !== id));
  };

  const deleteBuyRequest = async (id?: number) => {
    if (!id) return;

    await fetch(`http://127.0.0.1:8000/api/marketplace/buy/${id}`, {
      method: "DELETE",
    });

    setBuyList(prev => prev.filter(item => item.id !== id));
  };


  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* BACKGROUND IMAGE - FULL PAGE */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1597643277617-34b2f06110a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBmaWVsZCUyMHN1bnNldCUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3Njg3ODY1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Agricultural background"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75"></div>
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 px-6 pt-16 pb-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-400 tracking-tight mb-4 drop-shadow-2xl">
            Agri Marketplace
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Direct farmer-to-farmer marketplace for selling produce and requesting crops - transparent, simple, and fair.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 px-6 pb-16">
        {/* Tab Selector - Moved Down */}
        <div className="max-w-5xl mx-auto mb-12 mt-8">
          <div className="inline-flex bg-white/95 backdrop-blur-xl rounded-3xl p-2 shadow-2xl border border-white/50 mx-auto block w-auto">
            <button
              onClick={() => setActiveTab("sell")}
              className={`px-10 py-5 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 text-lg ${activeTab === "sell"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105"
                : "text-gray-600 hover:bg-green-50/50"
                }`}
            >
              <FaStore className="text-xl" /> Sell Products
            </button>
            <button
              onClick={() => setActiveTab("buy")}
              className={`px-10 py-5 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 text-lg ${activeTab === "buy"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105"
                : "text-gray-600 hover:bg-green-50/50"
                }`}
            >
              <FaShoppingCart className="text-xl" /> Buy Products
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === "sell" ? (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* SELL FORM */}
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/50 hover:shadow-3xl transition-shadow">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <FaPlusCircle className="text-white text-2xl" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    List Your Produce
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Your Name"
                      value={sellForm.name}
                      onChange={e => setSellForm({ ...sellForm, name: e.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Contact Number"
                      value={sellForm.contact}
                      onChange={e => setSellForm({ ...sellForm, contact: e.target.value })}
                    />
                  </div>

                  <input
                    className="input"
                    placeholder="Product Name (e.g., Rice, Wheat, Tomatoes)"
                    value={sellForm.product}
                    onChange={e => setSellForm({ ...sellForm, product: e.target.value })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Quantity (e.g., 50 Kg)"
                      value={sellForm.quantity}
                      onChange={e => setSellForm({ ...sellForm, quantity: e.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Price (₹)"
                      value={sellForm.price}
                      onChange={e => setSellForm({ ...sellForm, price: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={addSellProduct}
                    className="w-full mt-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-2xl transition-all shadow-xl text-xl"
                  >
                    <FaPlusCircle className="text-2xl" /> Add Product to Marketplace
                  </button>
                </div>
              </div>

              {/* SELL LIST */}
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/50 hover:shadow-3xl transition-shadow">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-emerald-600 to-green-700 p-4 rounded-2xl shadow-lg">
                      <FaBoxOpen className="text-white text-2xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">Your Products</h3>
                  </div>
                  <span className="px-5 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-base shadow-lg">
                    {sellList.length}
                  </span>
                </div>

                {sellList.length === 0 ? (
                  <div className="h-[340px] flex flex-col items-center justify-center text-gray-500">
                    <FaBoxOpen className="text-7xl mb-5 opacity-30" />
                    <p className="text-lg">No products listed yet.</p>
                    <p className="text-sm mt-2">Add your first product to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-5 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                    {sellList.map((item, i) => (
                      <div
                        key={i}
                        className="relative bg-gradient-to-br from-green-50/95 to-emerald-50/80 rounded-2xl p-6 border-2 border-green-200 shadow-md hover:shadow-xl transition-all hover:scale-[1.02]"
                      >
                        <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-green-600 to-emerald-700 rounded-l-2xl" />

                        <button
                          onClick={() => deleteSellProduct(item.id)}
                          className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm px-5 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all z-10"
                        >
                          ✕ Delete
                        </button>

                        <div className="pr-2 mb-4">
                          <h4 className="font-bold text-gray-800 text-xl mb-3">{item.product}</h4>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 rounded-xl">
                              <span className="text-2xl font-extrabold text-white">
                                ₹{item.price}
                              </span>
                            </div>
                            <div className="bg-gray-100 px-4 py-2 rounded-xl">
                              <span className="text-lg text-gray-700 font-semibold">
                                {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-green-200 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-bold">👤</span>
                            <span>{item.name || "Anonymous"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-bold">📞</span>
                            <span>{item.contact}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-bold">📦</span>
                            <span>{item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-bold">📅</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* BUY FORM */}
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/50 hover:shadow-3xl transition-shadow">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <FaSearch className="text-white text-2xl" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    Request to Buy
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Your Name"
                      value={buyForm.name}
                      onChange={e => setBuyForm({ ...buyForm, name: e.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Contact Number"
                      value={buyForm.contact}
                      onChange={e => setBuyForm({ ...buyForm, contact: e.target.value })}
                    />
                  </div>

                  <input
                    className="input"
                    placeholder="Product Looking For (e.g., Organic Rice)"
                    value={buyForm.product}
                    onChange={e => setBuyForm({ ...buyForm, product: e.target.value })}
                  />

                  <input
                    className="input"
                    placeholder="Quantity Needed (e.g., 100 Kg)"
                    value={buyForm.quantity}
                    onChange={e => setBuyForm({ ...buyForm, quantity: e.target.value })}
                  />

                  <button
                    onClick={addBuyRequest}
                    className="w-full mt-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-2xl transition-all shadow-xl text-xl"
                  >
                    <FaPaperPlane className="text-2xl" /> Send Buy Request
                  </button>
                </div>
              </div>

              {/* BUY LIST */}
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/50 hover:shadow-3xl transition-shadow">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-emerald-600 to-green-700 p-4 rounded-2xl shadow-lg">
                      <FaClipboardList className="text-white text-2xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">Buy Requests</h3>
                  </div>
                  <span className="px-5 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-base shadow-lg">
                    {buyList.length}
                  </span>
                </div>

                {buyList.length === 0 ? (
                  <div className="h-[340px] flex flex-col items-center justify-center text-gray-500">
                    <FaClipboardList className="text-7xl mb-5 opacity-30" />
                    <p className="text-lg">No buy requests yet.</p>
                    <p className="text-sm mt-2">Create your first buy request!</p>
                  </div>
                ) : (
                  <div className="space-y-5 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                    {buyList.map((item, i) => (
                      <div
                        key={i}
                        className="relative bg-gradient-to-br from-green-50/95 to-emerald-50/80 rounded-2xl p-6 border-2 border-green-200 shadow-md hover:shadow-xl transition-all hover:scale-[1.02]"
                      >
                        <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-green-600 to-emerald-700 rounded-l-2xl" />

                        <button
                          onClick={() => deleteBuyRequest(item.id)}
                          className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm px-5 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all z-10"
                        >
                          ✕ Delete
                        </button>

                        <div className="pr-2 mb-4">
                          <h4 className="font-bold text-gray-800 text-xl mb-3">
                            Looking for: {item.product}
                          </h4>
                          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 rounded-xl inline-block">
                            <p className="text-2xl font-extrabold text-white">
                              {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-green-200 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-bold">👤</span>
                            <span>{item.name || "Anonymous"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-bold">📞</span>
                            <span>{item.contact}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-bold">📦</span>
                            <span>{item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-bold">📅</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 16px 20px;
          border-radius: 16px;
          border: 2px solid #bbf7d0;
          background: #f0fdf4;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .input:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
          background: white;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #16a34a, #059669);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #15803d, #047857);
        }
      `}</style>
    </div>
  );
}
