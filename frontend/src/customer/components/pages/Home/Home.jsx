import React from "react";
import ClothesCategory from "./ClothesCategory/ClothesCategory";
import Deal from "./Deal/Deal";
import HomeCategory from "./HomeCategory/HomeCategory";
import Button from "@mui/material/Button";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router";

const heroBanners = [
  {
    id: 1,
    tag: "NEW ARRIVALS",
    title: "Epic Action\nFigures",
    subtitle: "Marvel, DC, Anime & more — over 500 characters",
    cta: "Shop Now",
    path: "/products/action-figures",
    bg: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    accent: "#e85d04",
    imageClass:
      "h-full max-h-[320px] w-auto object-contain rounded-xl opacity-90",
    image:
      "https://queenstudios.shop/cdn/shop/files/7.MajesticportrayalofOptimusPrimebyQueenStudiosinlifelikeproportions_620x.png?v=1719568083",
  },
  {
    id: 2,
    tag: "BESTSELLER",
    title: "RC Cars &\nDrones",
    subtitle: "High-speed remote control toys for every adventurer",
    cta: "Explore",
    path: "/products/outdoor-rc",
    bg: "linear-gradient(135deg, #003049 0%, #0077b6 100%)",
    accent: "#f77f00",
    image:
      "https://www.vajjexrc.com/cdn/shop/files/cfa90addbe6c8c922afc942f71ffe625_1200x1200.jpg?v=1718005664",
  },
  {
    id: 3,
    tag: "CAR MODELS",
    title: "CARS",
    subtitle: "Spark creativity with award-winning building toys",
    cta: "Build More",
    path: "/products/educational-blocks",
    bg: "linear-gradient(135deg, #1b1b2f 0%, #e94560 100%)",
    accent: "#ffd166",
    image:
      "https://www.sam-turner.co.uk/cdn/shop/products/71397_alt3_1200x1200.jpg?v=1636369197",
  },
];

const promoCards = [
  {
    title: "Board Games",
    subtitle: "Family nights done right",
    bg: "#0f3460",
    image: "https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg",
    path: "/products/board-games",
  },
  {
    title: "Outdoor Play",
    subtitle: "Get them moving",
    bg: "#2d6a4f",
    image: "https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg",
    path: "/products/outdoor-toys",
  },
  {
    title: "Educational",
    subtitle: "Smart toys, smart kids",
    bg: "#7b2d8b",
    image: "https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg",
    path: "/products/educational-toys",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [activeHero, setActiveHero] = React.useState(0);
  const hero = heroBanners[activeHero];

  React.useEffect(() => {
    const t = setInterval(
      () => setActiveHero((p) => (p + 1) % heroBanners.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#f4f4f4" }}>
      <section
        style={{
          background: hero.bg,
          minHeight: 420,
          transition: "background 0.8s ease",
        }}
        className="relative overflow-hidden"
      >
        <div className="lg:px-16 px-5 py-12 lg:py-0 lg:h-[420px] flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Text side */}
          <div className="text-white space-y-4 lg:w-[55%] z-10">
            <span
              className="text-xs font-black tracking-widest px-3 py-1 rounded"
              style={{ background: hero.accent, color: "white" }}
            >
              {hero.tag}
            </span>
            <h1
              className="section-heading text-5xl lg:text-7xl leading-tight"
              style={{ whiteSpace: "pre-line" }}
            >
              {hero.title}
            </h1>
            <p className="text-slate-300 text-lg max-w-md">{hero.subtitle}</p>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => navigate(hero.path)}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: hero.accent,
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: 15,
                  fontWeight: 800,
                  "&:hover": {
                    filter: "brightness(1.1)",
                    background: hero.accent,
                  },
                }}
              >
                {hero.cta}
              </Button>
              <Button
                onClick={() => navigate("/products/all")}
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.4)",
                  px: 3,
                  py: 1.5,
                }}
              >
                All Toys
              </Button>
            </div>
          </div>

          {/* Image side */}
          <div className="lg:w-[45%] h-[280px] lg:h-full relative flex items-center justify-center">
            <img
              key={hero.id}
              src={hero.image}
              alt={hero.title}
              className={hero.imageClass}
              style={{ transition: "opacity 0.6s ease" }}
            />
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `linear-gradient(to right, ${hero.bg.includes("0f0c29") ? "#0f0c29" : hero.bg.includes("003049") ? "#003049" : "#1b1b2f"} 0%, transparent 40%)`,
              }}
            />
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveHero(i)}
              style={{
                width: i === activeHero ? 28 : 10,
                height: 10,
                borderRadius: 999,
                background:
                  i === activeHero ? hero.accent : "rgba(255,255,255,0.35)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </section>

      <section
        style={{ background: "white", borderBottom: "1px solid #e5e7eb" }}
      >
        <ClothesCategory />
      </section>

      <section className="lg:px-16 px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-heading text-2xl text-gray-900">
            SHOP BY THEME
          </h2>
          <button
            onClick={() => navigate("/products/all")}
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            View All <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {promoCards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="relative rounded-xl overflow-hidden cursor-pointer h-44 group"
              style={{ background: card.bg }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3 className="section-heading text-2xl text-white">
                  {card.title}
                </h3>
                <p className="text-slate-300 text-sm">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#1a1a2e" }} className="py-10">
        <div className="lg:px-16 px-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="section-heading text-2xl text-white">
                TODAY'S DEALS
              </span>
              <span
                className="text-xs font-black px-2 py-1 rounded animate-pulse"
                style={{ background: "#e85d04", color: "white" }}
              >
                LIVE
              </span>
            </div>
            <button
              onClick={() => navigate("/products/all")}
              className="text-sm font-bold flex items-center gap-1"
              style={{ color: "#e85d04" }}
            >
              See All Deals <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
          <Deal />
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="lg:px-16 px-5 py-12" style={{ background: "white" }}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading text-2xl text-gray-900">
            BROWSE CATEGORIES
          </h2>
          <button
            onClick={() => navigate("/products/all")}
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            All Categories <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
        <HomeCategory />
      </section>

      {/* ── BECOME A SELLER BANNER ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #e85d04 0%, #c94e00 100%)",
        }}
        className="py-14 px-5 lg:px-16"
      >
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-white space-y-3">
            <p className="text-sm font-bold tracking-widest opacity-80">
              FOR SELLERS
            </p>
            <h2 className="section-heading text-4xl lg:text-5xl">
              Sell Your Toys on ToyVerse
            </h2>
            <p className="text-orange-100 text-lg max-w-lg">
              Reach thousands of toy buyers across Nepal. Set up your store in
              minutes — free to join.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              onClick={() => navigate("/become-seller")}
              variant="contained"
              startIcon={<StorefrontIcon />}
              sx={{
                background: "white",
                color: "#e85d04",
                px: 4,
                py: 1.8,
                fontSize: 15,
                fontWeight: 800,
                "&:hover": { background: "#fff3e0" },
              }}
            >
              Start Selling
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.6)",
                px: 4,
                py: 1.8,
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
