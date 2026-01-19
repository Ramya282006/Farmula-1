import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Sprout, Droplets, Package, Shield, Calendar, Image, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';

const PlantationGuidePage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const guidanceCards = [
    {
      id: 1,
      title: "Soil Preparation",
      description: "Essential steps for optimal soil readiness",
      icon: Sprout,
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop&q=80",
      steps: [
        "Test soil pH levels (ideal range: 6.0-7.0) and nutrient content before starting preparation",
        "Remove weeds, rocks, and debris thoroughly from the planting area",
        "Till the soil to 8-12 inches depth to improve aeration and drainage",
        "Add organic compost or well-rotted manure (2-3 inches layer) and mix evenly",
        "Level the field and create proper drainage channels to prevent waterlogging"
      ]
    },
    {
      id: 2,
      title: "Planting Guide",
      description: "Master proper planting techniques",
      icon: Sprout,
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop&q=80",
      steps: [
        "Choose certified seeds or healthy seedlings from reliable sources",
        "Plant at the right depth (typically 2-3 times the seed size) for optimal germination",
        "Maintain proper spacing between plants to ensure adequate sunlight and airflow",
        "Water immediately after planting to settle soil around roots",
        "Mark rows clearly and maintain records of planting dates and varieties"
      ]
    },
    {
      id: 3,
      title: "Irrigation",
      description: "Smart watering for healthy crops",
      icon: Droplets,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop&q=80",
      steps: [
        "Water early morning (6-10 AM) or late evening to minimize evaporation",
        "Apply water at soil level to prevent leaf diseases and reduce water waste",
        "Monitor soil moisture regularly - water when top 2 inches feel dry",
        "Use drip irrigation or soaker hoses for efficient water delivery",
        "Adjust watering frequency based on weather, growth stage, and soil type"
      ]
    },
    {
      id: 4,
      title: "Fertilizer Management",
      description: "Optimize nutrition for maximum yield",
      icon: Package,
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop&q=80",
      steps: [
        "Conduct soil tests every season to determine exact nutrient requirements",
        "Apply base fertilizer 2 weeks before planting for nutrient availability",
        "Use balanced NPK ratios appropriate for your specific crop type",
        "Split fertilizer applications: 50% at planting, 25% at vegetative stage, 25% at flowering",
        "Combine organic and synthetic fertilizers for sustained nutrient release"
      ]
    },
    {
      id: 5,
      title: "Pest Control",
      description: "Protect with integrated pest management",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&q=80",
      steps: [
        "Inspect plants daily for early signs of pest infestation or disease",
        "Use neem oil or organic pesticides as first line of defense",
        "Implement crop rotation to break pest life cycles naturally",
        "Introduce beneficial insects like ladybugs for biological pest control",
        "Apply chemical pesticides only as last resort, following safety guidelines"
      ]
    },
    {
      id: 6,
      title: "Harvest & Storage",
      description: "Perfect timing and preservation",
      icon: Calendar,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&q=80",
      steps: [
        "Harvest at peak maturity - early morning when crops are crisp and cool",
        "Use clean, sharp tools to prevent damage and disease transmission",
        "Handle produce gently to avoid bruising and reduce post-harvest losses",
        "Clean and sort harvested crops immediately, removing damaged items",
        "Store in cool, dry, well-ventilated areas with proper temperature control"
      ]
    },
    {
      id: 7,
      title: "Do's and Don'ts",
      description: "Critical practices for farming success",
      icon: CheckCircle,
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop&q=80",
      steps: [
        "DO: Rotate crops seasonally to maintain soil health and prevent nutrient depletion",
        "DON'T: Over-water plants - it leads to root rot and fungal diseases",
        "DO: Mulch around plants to retain moisture and suppress weed growth",
        "DON'T: Plant the same crop family in the same location consecutively",
        "DO: Keep detailed farm records including planting dates, inputs, and yields"
      ]
    },
    {
      id: 8,
      title: "Common Mistakes",
      description: "Avoid frequent farming errors",
      icon: AlertCircle,
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&h=600&fit=crop&q=80",
      steps: [
        "Planting too deep or too shallow - always follow recommended seed depth",
        "Ignoring soil pH requirements leading to nutrient lockout and poor growth",
        "Overcrowding plants which reduces air circulation and increases disease risk",
        "Applying fertilizers without soil testing, causing nutrient imbalances",
        "Harvesting too early or too late, reducing quality and market value"
      ]
    },
    {
      id: 9,
      title: "Expert Tips",
      description: "Professional insights for better results",
      icon: Lightbulb,
      image: "https://images.unsplash.com/photo-1595838103603-4abf5d375e3e?w=800&h=600&fit=crop&q=80",
      steps: [
        "Create a planting calendar based on local climate and frost dates",
        "Use companion planting to naturally deter pests and improve growth",
        "Install rain gauges and soil moisture sensors for precise irrigation",
        "Start composting farm waste to create free, high-quality organic fertilizer",
        "Join local farming cooperatives to share knowledge and resources"
      ]
    },
    {
      id: 10,
      title: "Image Gallery",
      description: "Visual guide to farming techniques",
      icon: Image,
      image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800&h=600&fit=crop&q=80",
      steps: [
        "Browse high-resolution images of successful planting techniques",
        "View before and after photos of proper soil preparation",
        "See examples of healthy vs diseased plants for early detection",
        "Study irrigation system installations and configurations",
        "Explore harvest timing indicators across different crop varieties"
      ]
    }
  ];

  const openModal = (card) => {
    setSelectedCard(card);
    setCurrentStep(0);
  };

  const closeModal = () => {
    setSelectedCard(null);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < selectedCard.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const scrollContainer = (direction) => {
    const container = document.getElementById('cards-container');
    const scrollAmount = 280;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Elegant Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Refined Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-xl">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-sm font-medium transition-all backdrop-blur-sm mb-4 hover:gap-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Plantation Guidance
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Click any card to explore step-by-step farming guidance
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={() => scrollContainer('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-green-600 hover:bg-green-50 transition-all hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => scrollContainer('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-green-600 hover:bg-green-50 transition-all hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Cards Container */}
            <div
              id="cards-container"
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {guidanceCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => openModal(card)}
                    className="flex-shrink-0 w-64 snap-start"
                  >
                    <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full border border-green-50">
                      {/* Image Section */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>

                        {/* Icon Badge */}
                        <div className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                          <IconComponent className="w-5 h-5 text-green-600" />
                        </div>

                        {/* Card Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                            {card.title}
                          </h3>
                          <p className="text-slate-200 text-xs leading-snug mb-2 line-clamp-2">
                            {card.description}
                          </p>

                          {/* Rating Dots */}
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((dot) => (
                              <div key={dot} className="w-1 h-1 bg-green-400 rounded-full"></div>
                            ))}
                          </div>

                          {/* CTA Button */}
                          <button className="w-full bg-white hover:bg-green-50 text-slate-800 font-semibold py-2 rounded-lg transition-all text-xs group-hover:bg-green-500 group-hover:text-white">
                            View Steps
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white relative">
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm text-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="flex flex-col items-center justify-center pt-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mb-3">
                  {React.createElement(selectedCard.icon, { className: "w-6 h-6" })}
                </div>
                <h2 className="text-2xl font-bold text-center">{selectedCard.title}</h2>
                <p className="text-white/90 text-sm mt-1">
                  Step {currentStep + 1} of {selectedCard.steps.length}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 min-h-[160px] flex items-center justify-center border border-green-100">
                <p className="text-base text-slate-700 leading-relaxed text-center max-w-xl">
                  {selectedCard.steps[currentStep]}
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-5 gap-3">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${currentStep === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg hover:-translate-x-0.5'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Progress Indicators */}
                <div className="flex gap-1.5">
                  {selectedCard.steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${index === currentStep
                          ? 'w-6 bg-gradient-to-r from-green-500 to-emerald-600'
                          : 'w-1.5 bg-slate-300'
                        }`}
                    ></div>
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  disabled={currentStep === selectedCard.steps.length - 1}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${currentStep === selectedCard.steps.length - 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg hover:translate-x-0.5'
                    }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PlantationGuidePage;