import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Brain,
  Leaf,
  Droplets,
  Thermometer,
  CloudRain,
  Zap,
  Waves,
  TestTube,
  Sprout,
  Cpu,
  Gauge,
  BarChart3,
  Shield,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

/* =======================================================================================
   CROP IMAGE MAP
======================================================================================= */

const cropImages: Record<string, string> = {
  rice: "https://images.unsplash.com/photo-1536304929831-6e0155be1b18?q=80&w=800",
  maize: "https://images.unsplash.com/photo-1603910234804-b8b63a5c5d62?q=80&w=800",
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800",
  chickpea: "https://images.unsplash.com/photo-1596527109917-97679a6e3e0e?q=80&w=800",
  kidneybeans: "https://images.unsplash.com/photo-1583926288670-f2eb8c9e9295?q=80&w=800",
  pigeonpeas: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=800",
  mothbeans: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=800",
  mungbean: "https://images.unsplash.com/photo-1607623488235-f6b391864c3e?q=80&w=800",
  blackgram: "https://images.unsplash.com/photo-1607623488235-f6b391864c3e?q=80&w=800",
  lentil: "https://images.unsplash.com/photo-1596527109917-97679a6e3e0e?q=80&w=800",
  pomegranate: "https://images.unsplash.com/photo-1603540075746-0fdaa011e4a5?q=80&w=800",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=800",
  mango: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?q=80&w=800",
  grapes: "https://images.unsplash.com/photo-1599819177442-2c94e489b78a?q=80&w=800",
  watermelon: "https://images.unsplash.com/photo-1587049352846-4a222e784343?q=80&w=800",
  muskmelon: "https://images.unsplash.com/photo-1621583832680-0e44d36d206b?q=80&w=800",
  apple: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=800",
  orange: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=800",
  papaya: "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?q=80&w=800",
  coconut: "https://images.unsplash.com/photo-1598926411052-23e50c9ee92d?q=80&w=800",
  cotton: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800",
  jute: "https://images.unsplash.com/photo-1619057386228-c5c7c6e6f9c5?q=80&w=800",
  coffee: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800",
};

/* =======================================================================================
   TYPES
======================================================================================= */

type InputKey =
  | 'nitrogen'
  | 'phosphorus'
  | 'potassium'
  | 'pH'
  | 'temperature'
  | 'humidity'
  | 'rainfall';

type ParameterConfig = {
  key: InputKey;
  label: string;
  unit: string;
  icon: any;
  gradient: string;
  min: number;
  max: number;
  step: number;
  description: string;
};

/* =======================================================================================
   MAIN COMPONENT
======================================================================================= */

export function CropPredictorPage() {
  /* -----------------------------------------------------------------------------
     STATE
  ----------------------------------------------------------------------------- */

  const [inputValues, setInputValues] = useState({
    nitrogen: 45,
    phosphorus: 38,
    potassium: 42,
    pH: 6.8,
    temperature: 28,
    humidity: 65,
    rainfall: 180,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictedCrop, setPredictedCrop] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [farmerName] = useState("Farmer");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /* -----------------------------------------------------------------------------
     SCROLL ANIMATIONS
  ----------------------------------------------------------------------------- */

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  /* -----------------------------------------------------------------------------
     BACKEND CALL (UNCHANGED)
  ----------------------------------------------------------------------------- */

  const handlePredict = async () => {
    setIsAnalyzing(true);
    setShowPrediction(false);
    setApiError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/crop/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          N: inputValues.nitrogen,
          P: inputValues.phosphorus,
          K: inputValues.potassium,
          temperature: inputValues.temperature,
          humidity: inputValues.humidity,
          ph: inputValues.pH,
          rainfall: inputValues.rainfall,
        }),
      });

      if (!response.ok) throw new Error('Prediction failed');

      const data = await response.json();

      setTimeout(() => {
        setPredictedCrop(data.recommended_crop);
        setIsAnalyzing(false);
        setShowPrediction(true);
      }, 2300);
    } catch (error) {
      setIsAnalyzing(false);
      setApiError('Unable to predict crop. Please try again.');
    }
  };

  const handleReset = () => {
    setShowPrediction(false);
    setIsAnalyzing(false);
  };

  const parameters: ParameterConfig[] = useMemo(
    () => [
      {
        key: 'nitrogen',
        label: 'Nitrogen',
        unit: 'kg/ha',
        icon: Leaf,
        gradient: 'from-emerald-500 to-teal-600',
        min: 0,
        max: 120,
        step: 1,
        description: 'Essential for leaf growth',
      },
      {
        key: 'phosphorus',
        label: 'Phosphorus',
        unit: 'kg/ha',
        icon: Waves,
        gradient: 'from-blue-500 to-cyan-600',
        min: 0,
        max: 120,
        step: 1,
        description: 'Supports root development',
      },
      {
        key: 'potassium',
        label: 'Potassium',
        unit: 'kg/ha',
        icon: Zap,
        gradient: 'from-violet-500 to-purple-600',
        min: 0,
        max: 120,
        step: 1,
        description: 'Improves disease resistance',
      },
      {
        key: 'pH',
        label: 'Soil pH',
        unit: '',
        icon: TestTube,
        gradient: 'from-lime-500 to-green-600',
        min: 3,
        max: 10,
        step: 0.1,
        description: 'Controls nutrient availability',
      },
      {
        key: 'temperature',
        label: 'Temperature',
        unit: '°C',
        icon: Thermometer,
        gradient: 'from-orange-500 to-red-600',
        min: 0,
        max: 50,
        step: 1,
        description: 'Ambient temperature',
      },
      {
        key: 'humidity',
        label: 'Humidity',
        unit: '%',
        icon: Droplets,
        gradient: 'from-sky-500 to-indigo-600',
        min: 0,
        max: 100,
        step: 1,
        description: 'Moisture content in air',
      },
      {
        key: 'rainfall',
        label: 'Rainfall',
        unit: 'mm',
        icon: CloudRain,
        gradient: 'from-cyan-500 to-blue-600',
        min: 0,
        max: 400,
        step: 1,
        description: 'Total rainfall received',
      },
    ],
    []
  );

  /* -----------------------------------------------------------------------------
     FLOATING PARTICLES
  ----------------------------------------------------------------------------- */

  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 10,
    }));
  }, []);

  /* -----------------------------------------------------------------------------
     RENDER
  ----------------------------------------------------------------------------- */

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">
      {/* ================= HEADER (UNCHANGED) ================= */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 px-4 shadow-lg relative z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">Farmer Dashboard</h1>
            <p className="text-green-100 text-sm">Welcome back, {farmerName}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white hover:bg-green-700/50 rounded-full text-sm px-4 transition-transform hover:scale-105"
              onClick={() => {
                localStorage.removeItem("access_token");
                window.location.reload();
              }}
            >
              Logout
            </Button>

            <Button
              variant="ghost"
              className="text-white hover:bg-green-700/50 rounded-full text-sm px-3 transition-transform hover:scale-105"
              onClick={async () => {
                const newTheme = theme === "dark" ? "light" : "dark";
                setTheme(newTheme);
                document.documentElement.classList.toggle("dark");

                await fetch("http://127.0.0.1:8000/farmer/theme", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                  },
                  body: JSON.stringify({ theme: newTheme }),
                });
              }}
            >
              {theme === "dark" ? "Dark" : "Light"}
            </Button>

            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </header>

      {/* ================= SUBTLE BACKGROUND ORBS ================= */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-200/20 blur-3xl"
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-teal-200/20 blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, -80, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ================= FLOATING PARTICLES ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-emerald-400/10"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-20">
        {/* ================= HERO ================= */}
        <motion.div
          style={{ opacity, scale }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm">
              AI-Powered Agriculture
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Intelligent Crop Prediction
            </h1>

            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-6" />

            <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
              Analyze soil nutrients, climate parameters, and environmental data to recommend
              the most suitable crop for your land using machine learning.
            </p>
          </motion.div>
        </motion.div>

        {/* ================= PARAMETER GRID (COMPACT) ================= */}
        {!showPrediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
          >
            {parameters.map((param, index) => {
              const Icon = param.icon;
              const value = inputValues[param.key];

              return (
                <motion.div
                  key={param.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-5">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2.5 rounded-xl bg-gradient-to-br ${param.gradient} text-white shadow-md`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{param.label}</p>
                        <p className="text-xs text-gray-500">{param.description}</p>
                      </div>
                    </div>

                    {/* Value Display */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-900">{value}</span>
                        <span className="text-sm text-gray-500">{param.unit}</span>
                      </div>

                      {/* Slider */}
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={value}
                        onChange={(e) =>
                          setInputValues({
                            ...inputValues,
                            [param.key]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${((value - param.min) / (param.max - param.min)) * 100}%, rgb(229 231 235) ${((value - param.min) / (param.max - param.min)) * 100}%, rgb(229 231 235) 100%)`,
                        }}
                      />
                    </div>

                    {/* Number Input */}
                    <input
                      type="number"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={value}
                      onChange={(e) =>
                        setInputValues({
                          ...inputValues,
                          [param.key]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ================= ACTION BUTTON ================= */}
        {!showPrediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-16"
          >
            <Button
              onClick={handlePredict}
              disabled={isAnalyzing}
              className="px-12 py-6 rounded-full text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Brain className="w-6 h-6 mr-3" />
              Analyze & Predict Crop
            </Button>
          </motion.div>
        )}

        {/* ================= ANALYZING OVERLAY ================= */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              className="fixed inset-0 z-50 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 backdrop-blur-md flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <Cpu className="w-20 h-20 text-emerald-400" />
                </motion.div>
                <h3 className="text-white text-2xl font-semibold mb-2">
                  Analyzing Parameters
                </h3>
                <p className="text-emerald-200 text-lg">
                  Processing agricultural intelligence...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= RESULT DISPLAY ================= */}
        <AnimatePresence>
          {showPrediction && predictedCrop && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-5xl mx-auto"
            >
              {/* Main Result Card */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row items-center gap-10">
                  {/* Crop Image */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl blur-xl opacity-30" />
                    <img
                      src={
                        cropImages[predictedCrop.toLowerCase().replace(/\s+/g, '')] ||
                        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800"
                      }
                      alt={predictedCrop}
                      className="relative w-64 h-64 object-cover rounded-3xl shadow-2xl"
                    />
                  </motion.div>

                  {/* Result Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge className="mb-4 bg-emerald-600 text-white px-5 py-1.5 rounded-full">
                        Recommended Crop
                      </Badge>

                      <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4 capitalize">
                        {predictedCrop.replace(/([A-Z])/g, ' $1').trim()}
                      </h2>

                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        Based on your soil composition and environmental conditions,
                        this crop is predicted to yield optimal results for your farmland.
                      </p>

                      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-gray-700">Best Season</span>
                        </div>
                        <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          <span className="text-sm font-medium text-gray-700">Location Suitable</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Metrics Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-3 gap-6 mb-8"
              >
                {[
                  { icon: Gauge, label: 'Model Accuracy', value: '96.8%', color: 'from-emerald-500 to-teal-600' },
                  { icon: BarChart3, label: 'Yield Potential', value: 'High', color: 'from-blue-500 to-cyan-600' },
                  { icon: Shield, label: 'Risk Assessment', value: 'Low', color: 'from-violet-500 to-purple-600' },
                ].map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${metric.color} text-white mb-3 shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Key Insights
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: Leaf, text: 'Balanced nutrient profile supports healthy growth' },
                    { icon: CloudRain, text: 'Rainfall levels align with crop water requirements' },
                    { icon: Thermometer, text: 'Temperature range optimal for cultivation' },
                    { icon: Droplets, text: 'Humidity conditions favor transpiration' },
                  ].map((insight, i) => {
                    const Icon = insight.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all"
                      >
                        <div className="p-2 rounded-lg bg-emerald-100">
                          <Icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed pt-0.5">{insight.text}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-10 py-6 rounded-full text-lg font-semibold border-2 border-gray-300 hover:border-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  Run New Analysis
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
          >
            <p className="text-red-700 font-medium">{apiError}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
