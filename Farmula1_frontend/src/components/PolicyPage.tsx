import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Shield,
  Award,
  TrendingUp,
  Droplet,
  Tractor,
  Warehouse,
  Sprout,
  CreditCard,
  Check
} from 'lucide-react';

import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

/* ================= TYPES ================= */
type Scheme = {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  category: string;
  scheme_type: string;
  status: string;
  deadline: string;
  benefits: string[];
  apply_url: string;
};

export function PolicyPage() {
  /* ================= STATE ================= */
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [stats, setStats] = useState({ total_schemes: 0, applied_schemes: 0 });

  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  /* ================= FETCH ================= */
  useEffect(() => {
    loadData();
  }, [filterType, filterCategory]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);


  const loadData = async () => {
    const params = new URLSearchParams();
    if (filterType) params.append('scheme_type', filterType);
    if (filterCategory) params.append('category', filterCategory);

    const schemesRes = await fetch(
      `http://localhost:8000/policy/schemes?${params.toString()}`
    );
    const schemesData = await schemesRes.json();

    const appliedRes = await fetch('http://localhost:8000/policy/applied');
    const appliedData = await appliedRes.json();

    const statsRes = await fetch('http://localhost:8000/policy/stats');
    const statsData = await statsRes.json();

    setSchemes(schemesData);
    setAppliedIds(appliedData.applied_scheme_ids);
    setStats(statsData);
  };
  const normalizeCategory = (category: string) =>
    category.toLowerCase().replace(/[\s-]+/g, '_');
  // ✅ Random fallback icons
  const RANDOM_ICONS = [
    Award,
    Shield,
    Tractor,
    Droplet,
    Warehouse,
    Sprout,
    CreditCard,
    TrendingUp,
    FileText,
  ];

  /* ================= UI MAP ================= */
  const iconMap: Record<string, any> = {
    subsidy: Award,
    insurance: Shield,
    equipment: Tractor,
    irrigation: Droplet,
    seed: Sprout,
    credit: CreditCard,
    storage: Warehouse,
    training: FileText,
    market: TrendingUp,
    organic: Sprout,
    fisheries: Droplet,
    infrastructure: Warehouse,
    technology: TrendingUp,
    export: TrendingUp,
    livestock: Sprout,
    dairy: Sprout,
    forestry: Sprout,
    energy: CreditCard,
    digital: TrendingUp,
    education: FileText,
    water: Droplet,
    conservation: Droplet,
    innovation: TrendingUp,
    livelihood: CreditCard,
    processing: Warehouse,
    seeds: Sprout,
    horticulture: Sprout,
    food: Sprout,
    cooperative: FileText,
    farming: Sprout,
    post_harvest: Warehouse,
    plant_protection: Shield,
    price_support: CreditCard,
  };

  // ✅ SEARCH FILTER LOGIC
  const filteredSchemes = useMemo(() => {
    if (!debouncedSearch) return schemes;

    return schemes.filter((scheme) => {
      const searchableText = `
      ${scheme.title}
      ${scheme.short_description}
      ${scheme.full_description}
      ${scheme.category}
      ${scheme.scheme_type}
      ${scheme.benefits.join(' ')}
    `.toLowerCase();

      return searchableText.includes(debouncedSearch);
    });
  }, [schemes, debouncedSearch]);
  // ✅ Random fallback gradients
  const RANDOM_GRADIENTS = [
    'from-indigo-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-teal-500 to-emerald-600',
    'from-orange-500 to-amber-600',
    'from-cyan-500 to-sky-600',
    'from-lime-500 to-green-600',
    'from-fuchsia-500 to-pink-600',
  ];


  const colorMap: Record<string, string> = {
    subsidy: 'from-blue-500 to-cyan-500',
    insurance: 'from-green-500 to-emerald-500',
    equipment: 'from-orange-500 to-red-500',
    irrigation: 'from-sky-500 to-blue-600',
    seed: 'from-lime-500 to-green-600',
    credit: 'from-purple-500 to-indigo-600',
    storage: 'from-amber-500 to-yellow-600',
    training: 'from-pink-500 to-rose-500',
    market: 'from-teal-500 to-emerald-600',
    organic: 'from-green-600 to-lime-500',
    fisheries: 'from-cyan-500 to-sky-600',
    infrastructure: 'from-gray-500 to-slate-600',
    technology: 'from-indigo-500 to-violet-600',
    export: 'from-fuchsia-500 to-pink-600',
    livestock: 'from-lime-600 to-green-700',
    dairy: 'from-emerald-500 to-teal-600',
    forestry: 'from-green-700 to-emerald-800',
    energy: 'from-yellow-500 to-orange-600',
    digital: 'from-blue-600 to-indigo-700',
    education: 'from-purple-600 to-fuchsia-700',
    water: 'from-sky-400 to-cyan-600',
    conservation: 'from-emerald-700 to-green-800',
    innovation: 'from-indigo-700 to-purple-800',
    livelihood: 'from-orange-500 to-amber-600',
    processing: 'from-rose-500 to-pink-600',
    seeds: 'from-lime-400 to-green-600',
    horticulture: 'from-green-500 to-teal-500',
    food: 'from-amber-500 to-orange-500',
    cooperative: 'from-violet-500 to-purple-600',
    farming: 'from-emerald-400 to-green-600',
    post_harvest: 'from-yellow-500 to-amber-600',
    plant_protection: 'from-red-500 to-rose-600',
    price_support: 'from-indigo-400 to-blue-600',
  };
  const getSchemeTheme = (scheme: Scheme) => {
    const text = `
    ${scheme.title}
    ${scheme.short_description}
    ${scheme.category}
  `.toLowerCase();

    if (text.includes("seed"))
      return { icon: Sprout, color: "from-lime-500 to-green-600" };

    if (text.includes("storage") || text.includes("warehouse"))
      return { icon: Warehouse, color: "from-amber-500 to-yellow-600" };

    if (text.includes("irrigation") || text.includes("water"))
      return { icon: Droplet, color: "from-sky-500 to-blue-600" };

    if (text.includes("drone") || text.includes("digital") || text.includes("iot"))
      return { icon: TrendingUp, color: "from-indigo-500 to-purple-600" };

    if (text.includes("infrastructure"))
      return { icon: Warehouse, color: "from-gray-500 to-slate-600" };

    if (text.includes("bamboo") || text.includes("forestry"))
      return { icon: Sprout, color: "from-green-700 to-emerald-800" };

    if (text.includes("fish") || text.includes("aquaponics"))
      return { icon: Droplet, color: "from-cyan-500 to-sky-600" };

    if (text.includes("mushroom"))
      return { icon: Sprout, color: "from-fuchsia-500 to-pink-600" };

    if (text.includes("startup") || text.includes("innovation"))
      return { icon: Award, color: "from-purple-500 to-pink-600" };

    if (text.includes("training") || text.includes("education"))
      return { icon: FileText, color: "from-pink-500 to-rose-500" };

    // ✅ fallback always colored
    const index = Math.abs(Number(scheme.id)) % RANDOM_GRADIENTS.length;

    return {
      icon: RANDOM_ICONS[index],
      color: RANDOM_GRADIENTS[index],
    };
  };



  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <FileText className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h1>Government Schemes</h1>
            <p className="text-indigo-100 text-sm">
              Official agricultural schemes & benefits
            </p>
          </div>
        </div>
      </div>

      {/* STATUS + FILTERS */}
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6 items-start">

        {/* FILTERS */}
        <Card className="lg:col-span-2 p-6 shadow-lg">
          <h3 className="mb-4 text-green-900">Filter Schemes</h3>

          <div className="flex flex-wrap gap-4">

            {/* ✅ SEARCH INPUT */}
            <input
              type="text"
              placeholder="Search schemes, benefits, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 rounded border w-full md:w-80"
            />

            <select
              className="p-2 rounded border"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >

              <option value="">All (Central + State)</option>
              <option value="central">Central Schemes</option>
              <option value="state">State Schemes</option>
            </select>

            <select
              className="p-2 rounded border"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="subsidy">Subsidy</option>
              <option value="insurance">Insurance</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
        </Card>

        {/* STATUS */}
        <Card className="p-6 shadow-lg bg-gradient-to-br from-green-600 to-green-700 text-white h-fit">
          <h3 className="mb-4">Your Status</h3>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Applied Schemes</span>
              <span>{stats.applied_schemes}</span>
            </div>
            <Progress
              value={
                stats.total_schemes
                  ? (stats.applied_schemes / stats.total_schemes) * 100
                  : 0
              }
              className="h-2"
            />
          </div>

          <div className="text-sm">
            Total Schemes: {stats.total_schemes}
          </div>
        </Card>
      </div>

      {/* SCHEMES LIST */}
      <div className="container mx-auto px-4 space-y-6 pb-10">
        {filteredSchemes.map((scheme) => {
          const normalizedCategory = normalizeCategory(scheme.category);
          const theme = getSchemeTheme(scheme);
          const Icon = theme.icon;
          const gradient = theme.color;

          const applied = appliedIds.includes(scheme.id);
       

          return (
            <motion.div key={scheme.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="shadow-lg overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                <div className="p-6">
                  <div className="flex gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
                    >
                      <Icon className="text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-green-900">{scheme.title}</h3>
                        <Badge>{scheme.status}</Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {scheme.short_description}
                      </p>

                      {/* BENEFITS – 2x2 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {scheme.benefits.slice(0, 4).map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600" />
                            {b}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          disabled={applied}
                          onClick={async () => {
                            await fetch(
                              `http://localhost:8000/policy/apply/${scheme.id}`,
                              { method: 'POST' }
                            );
                            window.open(scheme.apply_url, '_blank');
                            loadData();
                          }}
                        >
                          {applied ? 'Applied' : 'Apply Now'}
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setSelectedScheme(scheme)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {selectedScheme && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <Card className="w-full max-w-2xl p-8 rounded-2xl shadow-xl">

            {/* Title */}
            <h3 className="text-xl font-semibold text-green-900 mb-4">
              {selectedScheme.title}
            </h3>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed text-sm mb-8">
              {selectedScheme.full_description}
            </p>

            {/* Action */}
            <div className="flex justify-end">
              <Button
                className="px-8"
                onClick={() => setSelectedScheme(null)}
              >
                Close
              </Button>
            </div>

          </Card>
        </div>
      )}
    </div>
  );
}
