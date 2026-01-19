import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Sprout,
  Leaf,
  Sparkles,
  Users,
  Eye,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Reel {
  id: string;
  title: string;
  creator: {
    name: string;
    username: string;
    verified: boolean;
    avatar: string;
  };
  thumbnail: string;
  likes: number;
  comments: number;
  shares: number;
  views: string;
  tags: string[];
  description: string;
  duration: string;
  trending: boolean;
}

interface OrganicReelsPageProps {
  onNavigate?: (page: string) => void;
}

export function OrganicReelsPage({ onNavigate }: OrganicReelsPageProps) {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [bookmarkedReels, setBookmarkedReels] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const reels: Reel[] = [
    {
      id: '1',
      title: 'Composting Magic: Turn Kitchen Waste into Black Gold',
      creator: {
        name: 'Organic Guru Priya',
        username: '@organicpriya',
        verified: true,
        avatar: 'woman farmer portrait'
      },
      thumbnail: 'composting organic waste',
      likes: 12400,
      comments: 340,
      shares: 890,
      views: '45.2K',
      tags: ['Composting', 'ZeroWaste', 'OrganicFarming'],
      description: 'Learn how to make nutrient-rich compost from kitchen scraps in just 45 days! Perfect for your organic farm 🌱',
      duration: '0:58',
      trending: true
    },
    {
      id: '2',
      title: 'Natural Pest Control: No Chemicals Needed!',
      creator: {
        name: 'Farm Science Raj',
        username: '@farmraj',
        verified: true,
        avatar: 'male farmer portrait'
      },
      thumbnail: 'organic pest control garden',
      likes: 18700,
      comments: 520,
      shares: 1200,
      views: '67.8K',
      tags: ['PestControl', 'Natural', 'Sustainable'],
      description: 'Neem oil + garlic spray = bye bye pests! Chemical-free solution for healthy crops 🦗🚫',
      duration: '1:15',
      trending: true
    },
    {
      id: '3',
      title: 'Vermicompost Setup: Earthworms as Farm Helpers',
      creator: {
        name: 'Eco Farmer Maya',
        username: '@ecomaya',
        verified: true,
        avatar: 'woman gardening'
      },
      thumbnail: 'vermicompost earthworms soil',
      likes: 9800,
      comments: 280,
      shares: 650,
      views: '34.5K',
      tags: ['Vermicompost', 'SoilHealth', 'Earthworms'],
      description: 'Set up your own vermicompost unit with just ₹500! Best investment for organic farming 💚',
      duration: '1:32',
      trending: false
    },
    {
      id: '4',
      title: 'Crop Rotation Secrets for Maximum Yield',
      creator: {
        name: 'Harvest Expert Arun',
        username: '@harvestarun',
        verified: true,
        avatar: 'farmer in field'
      },
      thumbnail: 'crop rotation farming',
      likes: 15300,
      comments: 420,
      shares: 980,
      views: '52.1K',
      tags: ['CropRotation', 'YieldBoost', 'SmartFarming'],
      description: 'Master the 4-season crop rotation technique! Increase yield by 35% naturally 📈🌾',
      duration: '2:10',
      trending: true
    },
    {
      id: '5',
      title: 'Mulching: Save Water, Boost Growth',
      creator: {
        name: 'Green Thumbs Divya',
        username: '@greendivya',
        verified: true,
        avatar: 'woman with plants'
      },
      thumbnail: 'mulching organic farm',
      likes: 11200,
      comments: 310,
      shares: 720,
      views: '41.3K',
      tags: ['Mulching', 'WaterConservation', 'Organic'],
      description: 'Straw, leaves, grass clippings - turn them into perfect mulch! Save 40% irrigation water 💧',
      duration: '1:45',
      trending: false
    },
    {
      id: '6',
      title: 'Bio-Fertilizer Making at Home',
      creator: {
        name: 'Nature First Karan',
        username: '@naturekaran',
        verified: true,
        avatar: 'young male farmer'
      },
      thumbnail: 'organic fertilizer making',
      likes: 14600,
      comments: 390,
      shares: 850,
      views: '48.7K',
      tags: ['BioFertilizer', 'DIY', 'Organic'],
      description: 'Jeevamrut recipe that costs ₹50 but works like magic! Ancient wisdom for modern farming 🧪✨',
      duration: '1:28',
      trending: true
    },
    {
      id: '7',
      title: 'Companion Planting: Plants That Love Each Other',
      creator: {
        name: 'Botanical Bee',
        username: '@botanicalbee',
        verified: true,
        avatar: 'woman botanist'
      },
      thumbnail: 'companion planting garden',
      likes: 13400,
      comments: 360,
      shares: 790,
      views: '46.9K',
      tags: ['CompanionPlanting', 'Biodiversity', 'Natural'],
      description: 'Tomatoes + Basil = Perfect match! Learn which crops grow better together 🍅🌿',
      duration: '1:52',
      trending: false
    },
    {
      id: '8',
      title: 'Seed Saving Techniques for Next Season',
      creator: {
        name: 'Heritage Seeds Kumar',
        username: '@heritagekumar',
        verified: true,
        avatar: 'older farmer seeds'
      },
      thumbnail: 'seed saving collection',
      likes: 10900,
      comments: 290,
      shares: 670,
      views: '38.2K',
      tags: ['SeedSaving', 'Heritage', 'SelfReliant'],
      description: 'Save your own seeds, save money, preserve heritage varieties! Complete guide 🌱💰',
      duration: '2:05',
      trending: false
    }
  ];

  const currentReel = reels[currentReelIndex];

  const handleLike = () => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentReel.id)) {
        newSet.delete(currentReel.id);
      } else {
        newSet.add(currentReel.id);
      }
      return newSet;
    });
  };

  const handleBookmark = () => {
    setBookmarkedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentReel.id)) {
        newSet.delete(currentReel.id);
      } else {
        newSet.add(currentReel.id);
      }
      return newSet;
    });
  };

  const nextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
    }
  };

  const previousReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        previousReel();
      } else if (e.key === 'ArrowDown') {
        nextReel();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReelIndex]);

  const isLiked = likedReels.has(currentReel.id);
  const isBookmarked = bookmarkedReels.has(currentReel.id);

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {onNavigate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('landing')}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <motion.div
              className="p-2 bg-emerald-500 rounded-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Leaf className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-white text-xl">Organic Farming Reels</h1>
              <p className="text-green-300 text-sm">Learn • Grow • Thrive</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {reels.length} Videos
          </Badge>
        </div>
      </div>

      {/* Main Reel Container */}
      <div ref={containerRef} className="h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReel.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full max-w-md mx-auto"
          >
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
              <ImageWithFallback
                src={`https://source.unsplash.com/500x900/?${currentReel.thumbnail}`}
                alt={currentReel.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Play/Pause Overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center"
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Trending Badge */}
            {currentReel.trending && (
              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                className="absolute top-24 left-4 z-10"
              >
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4 py-2 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </Badge>
              </motion.div>
            )}

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
              {/* Creator Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex-shrink-0">
                  <ImageWithFallback
                    src={`https://source.unsplash.com/100x100/?${currentReel.creator.avatar}`}
                    alt={currentReel.creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{currentReel.creator.name}</span>
                    {currentReel.creator.verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <span className="text-green-300 text-sm">{currentReel.creator.username}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6"
                >
                  Follow
                </Button>
              </motion.div>

              {/* Title & Description */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h2 className="text-white text-lg leading-snug">
                  {currentReel.title}
                </h2>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {currentReel.description}
                </p>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2"
              >
                {currentReel.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 text-white text-sm"
              >
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {currentReel.views}
                </span>
                <span>•</span>
                <span>{currentReel.duration}</span>
              </motion.div>
            </div>

            {/* Right Side Action Buttons */}
            <div className="absolute right-4 bottom-32 space-y-6">
              {/* Like */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleLike}
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 p-0"
                >
                  <Heart
                    className={`w-7 h-7 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
                  />
                </Button>
                <span className="text-white text-sm mt-1">
                  {isLiked ? currentReel.likes + 1 : currentReel.likes > 1000 
                    ? `${(currentReel.likes / 1000).toFixed(1)}K` 
                    : currentReel.likes}
                </span>
              </motion.div>

              {/* Comment */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 p-0"
                >
                  <MessageCircle className="w-7 h-7 text-white" />
                </Button>
                <span className="text-white text-sm mt-1">
                  {currentReel.comments}
                </span>
              </motion.div>

              {/* Share */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 p-0"
                >
                  <Share2 className="w-7 h-7 text-white" />
                </Button>
                <span className="text-white text-sm mt-1">
                  {currentReel.shares}
                </span>
              </motion.div>

              {/* Bookmark */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleBookmark}
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 p-0"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-7 h-7 text-emerald-400 fill-emerald-400" />
                  ) : (
                    <Bookmark className="w-7 h-7 text-white" />
                  )}
                </Button>
              </motion.div>

              {/* Sound */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 p-0"
                >
                  {isMuted ? (
                    <VolumeX className="w-7 h-7 text-white" />
                  ) : (
                    <Volume2 className="w-7 h-7 text-white" />
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={previousReel}
                disabled={currentReelIndex === 0}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentReelIndex === 0
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                    : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                }`}
              >
                <ChevronUp className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextReel}
                disabled={currentReelIndex === reels.length - 1}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentReelIndex === reels.length - 1
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                    : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                }`}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Progress Indicator */}
            <div className="absolute top-20 left-0 right-0 px-4">
              <div className="flex gap-1">
                {reels.map((_, index) => (
                  <div
                    key={index}
                    className={`h-0.5 flex-1 rounded-full transition-all ${
                      index === currentReelIndex
                        ? 'bg-emerald-400'
                        : index < currentReelIndex
                        ? 'bg-white/50'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm">
          <ChevronUp className="w-4 h-4" />
          <span>Swipe or use arrow keys</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </motion.div>

      {/* Floating Animation */}
      <motion.div
        className="fixed top-32 left-8 w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full flex items-center justify-center z-0"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sprout className="w-8 h-8 text-emerald-300" />
      </motion.div>

      <motion.div
        className="fixed bottom-32 left-12 w-12 h-12 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full flex items-center justify-center z-0"
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Leaf className="w-6 h-6 text-yellow-300" />
      </motion.div>
    </div>
  );
}