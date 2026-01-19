import { useEffect, useState } from "react";

type Shop = {
  shop_name: string;
  category: string;
  district: string;
  contact: string;
  rating: number;
  map_url: string;
};

/* Category → Image mapping */
const categoryImages: Record<string, string> = {
  "Fertilizer":
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
  "Pesticide & Insecticide":
    "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c",
  "Seed dealers":
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  "Equipment":
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
  "Tractor rental":
    "https://images.unsplash.com/photo-1605007493699-af65834f8a0b",
};

/* fallback image */
const defaultImage =
  "https://images.unsplash.com/photo-1560493676-04071c5f467b";

export function EcommercePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchShops = async () => {
    setLoading(true);
    let url = "http://127.0.0.1:8000/shops";

    const params = new URLSearchParams();
    if (district) params.append("district", district);
    if (category) params.append("category", category);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setShops(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        🏪 Agri Shops Near You
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          className="p-2 border rounded"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="">All Districts</option>
          <option value="Erode">Erode</option>
          <option value="Salem">Salem</option>
          <option value="Madurai">Madurai</option>
          <option value="Coimbatore">Coimbatore</option>
          <option value="Thanjavur">Thanjavur</option>
        </select>

        <select
          className="p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Fertilizer">Fertilizer</option>
          <option value="Pesticide & Insecticide">
            Pesticide & Insecticide
          </option>
          <option value="Seed dealers">Seed dealers</option>
          <option value="Equipment">Equipment</option>
          <option value="Tractor rental">Tractor rental</option>
        </select>

        <button
          onClick={fetchShops}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Search
        </button>
      </div>

      {/* Content */}
      {loading && <p>Loading shops...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop, index) => {
          const image =
            categoryImages[shop.category] || defaultImage;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* Image */}
              <img
                src={image}
                alt={shop.category}
                className="h-40 w-full object-cover"
              />

              {/* Details */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-green-700">
                  {shop.shop_name}
                </h2>

                <p className="text-sm text-gray-600">
                  {shop.category} • {shop.district}
                </p>

                <p className="mt-2 text-sm">📞 {shop.contact}</p>
                <p className="text-sm">⭐ {shop.rating}</p>

                <a
                  href={shop.map_url}
                  target="_blank"
                  className="inline-block mt-3 text-green-600 font-medium underline"
                >
                  View Location
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {shops.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-10">
          No shops found
        </p>
      )}
    </div>
  );
}
