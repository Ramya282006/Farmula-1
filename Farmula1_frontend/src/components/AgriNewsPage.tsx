import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Newspaper,
  Clock,
  Share2,
  ExternalLink,
  Search,
} from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* =========================
   Backend News Interface
========================= */
interface NewsArticle {
  title: string;
  description: string;
  image: string | null;
  source: string;
  published_at: string;
  url: string;
}

/* =========================
   COMPONENT (NAMED EXPORT)
========================= */
export function AgriNewsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     Fetch news from backend
  ========================= */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/agriculture-news")
      .then((res) => res.json())
      .then((data) => {
        setNewsArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load agriculture news", err);
        setLoading(false);
      });
  }, []);

  /* =========================
     Search filter
  ========================= */
  const filteredNews = newsArticles.filter((article) => {
    const title = article.title?.toLowerCase() || "";
    const description = article.description?.toLowerCase() || "";

    return (
      title.includes(searchQuery.toLowerCase()) ||
      description.includes(searchQuery.toLowerCase())
    );
  });


  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading agriculture news...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50">
      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Newspaper className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl">Agri News Hub</h1>
              <p className="text-green-100">
                Real-time agriculture news from trusted sources
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search agriculture news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-white text-gray-900 placeholder-gray-400 focus:text-gray-900 focus:bg-white rounded-xl"
            />

          </div>
        </div>
      </div>

      {/* ================= NEWS LIST ================= */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <AnimatePresence>
          {filteredNews.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              className="mb-6"
            >
              <Card className="p-6 hover:shadow-xl transition">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* ================= IMAGE ================= */}
                  <div className="md:w-48 h-32 rounded-xl overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={
                        article.image && article.image.startsWith("http")
                          ? article.image
                          : "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* ================= CONTENT ================= */}
                  <div className="flex-1">
                    <Badge className="mb-2 bg-emerald-100 text-emerald-700">
                      {article.source}
                    </Badge>

                    <h3 className="text-xl mb-2">{article.title}</h3>

                    <p className="text-gray-600 mb-4">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(article.url, "_blank")}
                        >
                          Read More
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNews.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No agriculture news found.
          </div>
        )}
      </div>
    </div>
  );
}
