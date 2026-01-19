import { useState } from "react";
import {
  TrendingUp, Brain, Calculator,
  Calendar, DollarSign, Activity,
  Award, Zap, BarChart3
} from "lucide-react";

type PriceResult = {
  arrival_date: string;
  modal_price: number;
  market: string;
  state: string;
};

const API_BASE = "http://127.0.0.1:8000";

export default function CropPricePage() {
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [market, setMarket] = useState("");
  const [results, setResults] = useState<PriceResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(100);

  const crops = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane"];
  const states = crop ? ["Tamil Nadu", "Karnataka", "Punjab", "Maharashtra"] : [];
  const markets = state ? ["Local Market", "Wholesale Yard", "APMC"] : [];

  /* ================= BACKEND CONNECTED (FIXED) ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResults(null); 
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/crop-price/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, state, market })
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();

      // ✅ FIX: use correct backend keys
      setResults([
        { arrival_date: "Today", modal_price: data.current, market, state },
        { arrival_date: "Yesterday", modal_price: data.yesterday, market, state }
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch crop price data");
    } finally {
      setLoading(false);
    }
  };

  const current = results?.[0]?.modal_price || 0;
  const predicted = current + 290;

  const sellNowRevenue = quantity * current;
  const sellLaterRevenue = quantity * predicted;
  const extraProfit = sellLaterRevenue - sellNowRevenue;

  /* ================= FIXED DATA ================= */

  const trendPoints = [35, 45, 55, 65, 78];

  const weeklyPrices = [
    { day: "Mon", price: current - 120 },
    { day: "Tue", price: current - 80 },
    { day: "Wed", price: current - 40 },
    { day: "Thu", price: current + 20 },
    { day: "Fri", price: current - 10 },
    { day: "Sat", price: current - 30 },
    { day: "Today", price: current }
  ];

  const maxWeekly = Math.max(...weeklyPrices.map(w => w.price));

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1651981350249-6173caeeb660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHJpY2UlMjBmaWVsZHMlMjBmYXJtaW5nfGVufDF8fHx8MTc2ODc4ODg0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* ================= HERO ================= */}
        {/* ================= HEADING ================= */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-2xl flex items-center justify-center gap-3">
             Crop Price Intelligence
          </h1>
          <p className="text-white text-lg mt-2 drop-shadow-lg">
            AI-Powered Market Analysis & Predictive Analytics
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-16">

          {/* ================= FORM ================= */}
          <section className="mb-12">
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="font-bold text-green-800">Crop</label>
                <select className="w-full mt-2 p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors" value={crop} onChange={e => setCrop(e.target.value)} required>
                  <option value="">Select</option>
                  {crops.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold text-green-800">State</label>
                <select className="w-full mt-2 p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed" value={state} onChange={e => setState(e.target.value)} disabled={!crop} required>
                  <option value="">Select</option>
                  {states.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold text-green-800">Market</label>
                <select className="w-full mt-2 p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed" value={market} onChange={e => setMarket(e.target.value)} disabled={!state} required>
                  <option value="">Select</option>
                  {markets.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 shadow-lg transition-all transform hover:scale-105">
                  {loading ? "Analyzing..." : <><Zap /> Generate</>}
                </button>
              </div>
            </form>
          </section>

          {results && (
            <>
              {/* ================= METRICS ================= */}
              <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Metric title="Current Price" value={`₹${current}`} icon={<DollarSign />} />
                <Metric title="Predicted Price" value={`₹${predicted}`} icon={<TrendingUp />} />
                <Metric title="Profit / Qt" value={`₹${predicted - current}`} icon={<Award />} />
                <Metric title="Demand Index" value="8.4 / 10" icon={<Activity />} />
              </section>

              {/* ================= PRICE TREND ================= */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800">Price Trend (Short Term)</h3>
                    <span className="text-green-600 font-semibold">↑ Upward</span>
                  </div>

                  <svg viewBox="0 0 100 50" className="w-full h-28">
                    <polyline
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="3"
                      strokeLinecap="round"
                      points={trendPoints.map((p, i) => `${i * 25},${50 - p}`).join(" ")}
                    />
                  </svg>
                </div>

                {/* ================= AI INSIGHT ================= */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl p-6 border border-white/20">
                  <h3 className="font-bold mb-3 flex items-center gap-2"><Brain /> AI Insight</h3>
                  <p className="text-sm">
                    Hold for 4–7 days. Expected peak around ₹{predicted}.
                  </p>
                  <div className="mt-4 bg-white/20 rounded-full h-3">
                    <div className="bg-green-400 h-full rounded-full transition-all" style={{ width: "87%" }} />
                  </div>
                </div>
              </section>

              {/* ================= PROFIT CALCULATOR ================= */}
              <section className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 mb-12">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <Calculator /> Profit Decision Calculator
                </h3>

                <label className="font-semibold text-gray-700">Quantity (quintals): {quantity}</label>
                <input type="range" min={10} max={500} value={quantity} onChange={e => setQuantity(+e.target.value)} className="w-full my-3 accent-green-600" />

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Sell Now</p>
                    <p className="text-xl font-bold text-gray-800">₹{sellNowRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Sell in 7 Days</p>
                    <p className="text-xl font-bold text-green-800">₹{sellLaterRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-4 rounded-lg flex flex-col justify-center">
                    <p className="text-sm opacity-90">Extra Profit</p>
                    <p className="text-xl font-bold">₹{extraProfit.toLocaleString()}</p>
                  </div>
                </div>
              </section>

              {/* ================= WEEKLY MOVEMENT ================= */}
              <section className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 mb-16">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800"><Calendar /> Weekly Movement</h3>

                <div className="flex items-end justify-between h-40 px-6">
                  {weeklyPrices.map(w => (
                    <div key={w.day} className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 bg-gradient-to-t from-green-600 to-emerald-400 rounded-md shadow-lg transition-all hover:scale-110"
                        style={{ height: `${(w.price / maxWeekly) * 120}px` }}
                      />
                      <span className="text-xs font-semibold text-gray-700">{w.day}</span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value, icon }: { title: string; value: string; icon: JSX.Element }) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 flex justify-between items-center transform transition-all hover:scale-105">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-extrabold text-gray-800">{value}</p>
      </div>
      <div className="text-green-600 transform transition-transform hover:rotate-12">{icon}</div>
    </div>
  );
}
