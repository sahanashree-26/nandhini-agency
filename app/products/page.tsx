"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const PHONE_NUMBER = "916380347893";
const DISPLAY_PHONE_NUMBER = "6380347893";

const WHATSAPP_NUMBER = "919444486856";
const DISPLAY_WHATSAPP_NUMBER = "9444486856";

const SHOP_ADDRESS =
  "12/56, Thiruvalluvar Street, MGR Nagar, Chennai - 600078";

const GOOGLE_MAP_LINK =
  "https://share.google/EywqmfcnmJx28wkcK";

const WHATSAPP_MESSAGE =
  "Hi, I would like to enquire about products from Nandhini Agency.";

const PRODUCT_CATEGORIES = [
  {
    name: "Bucket",
    tamilName: "வாளி",
    icon: "🪣",
  },
  {
    name: "Mug",
    tamilName: "மக்",
    icon: "🥤",
  },
  {
    name: "Mop",
    tamilName: "மாப்",
    icon: "🧹",
  },
  {
    name: "Broom Stick",
    tamilName: "துடைப்பம்",
    icon: "🧹",
  },
  {
    name: "Dustbin",
    tamilName: "குப்பைத்தொட்டி",
    icon: "🗑️",
  },
  {
    name: "Mirror",
    tamilName: "கண்ணாடி",
    icon: "🪞",
  },
  {
    name: "Ball",
    tamilName: "பந்து",
    icon: "⚽",
  },
];

type ProductImage = {
  id?: number;
  image_url: string;
  display_order?: number;
};

type ProductVariant = {
  id?: number;
  sku?: string;
  colour?: string;
  color?: string;
  size?: string;
  price: number | string;
  stock_quantity?: number;
  stock?: number;
  quantity?: number;
};

type ProductCategory = {
  id?: number;
  name?: string;
  tamil_name?: string | null;
};

type Product = {
  id: number;
  name: string;
  tamil_name?: string | null;
  description?: string | null;
  category_id?: number;
  category?: ProductCategory | string | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
};

type CartItem = {
  productId: number;
  name: string;
  tamilName?: string | null;
  imageUrl: string;
  price: number;
  colour: string;
  quantity: number;
  stock: number;
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [language, setLanguage] =
    useState<"en" | "ta">("en");

  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedColour, setSelectedColour] =
    useState("all");
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");

  const [sortOption, setSortOption] = useState("default");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addedProductId, setAddedProductId] =
    useState<number | null>(null);

  const isTamil = language === "ta";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}`;

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const savedCart = localStorage.getItem(
      "nandhini-agency-cart",
    );

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch {
        localStorage.removeItem("nandhini-agency-cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "nandhini-agency-cart",
      JSON.stringify(cart),
    );
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/products`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load products. Server returned ${response.status}.`,
          );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.items)) {
          setProducts(data.items);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load products.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getFirstVariant = (product: Product) => {
    return product.variants?.[0];
  };

  const getPrice = (product: Product) => {
    return Number(getFirstVariant(product)?.price ?? 0);
  };

  const getStock = (product: Product) => {
    const variant = getFirstVariant(product);

    return Number(
      variant?.stock_quantity ??
        variant?.stock ??
        variant?.quantity ??
        0,
    );
  };

  const getColour = (product: Product) => {
    const variant = getFirstVariant(product);

    return (
      variant?.colour ||
      variant?.color ||
      "Standard"
    );
  };

  const getSize = (product: Product) => {
    return getFirstVariant(product)?.size || "Standard";
  };

  const getImageUrl = (product: Product) => {
    const sortedImages = [...(product.images || [])].sort(
      (firstImage, secondImage) =>
        (firstImage.display_order || 0) -
        (secondImage.display_order || 0),
    );

    return (
      sortedImages[0]?.image_url ||
      "https://placehold.co/700x600/FFF4E8/F97316?text=Nandhini+Agency"
    );
  };

  const getCategoryName = (product: Product) => {
    if (typeof product.category === "string") {
      return product.category;
    }

    if (product.category?.name) {
      return product.category.name;
    }

    const categoryNames: Record<number, string> = {
      1: "Bucket",
      2: "Mug",
      3: "Mop",
      4: "Broom Stick",
      5: "Dustbin",
      6: "Mirror",
      7: "Ball",
    };

    return (
      categoryNames[product.category_id ?? 0] ||
      "Other"
    );
  };

  const getCategoryIcon = (product: Product) => {
    const categoryName = getCategoryName(
      product,
    ).toLowerCase();

    const matchingCategory = PRODUCT_CATEGORIES.find(
      (category) =>
        category.name.toLowerCase() === categoryName ||
        `${category.name.toLowerCase()}s` === categoryName,
    );

    return matchingCategory?.icon || "🛍️";
  };

  const colours = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => getColour(product))
          .filter(Boolean),
      ),
    ).sort();
  }, [products]);

  const availableCategories = useMemo(() => {
    const categoryNames = products.map((product) =>
      getCategoryName(product),
    );

    return Array.from(
      new Set([
        ...PRODUCT_CATEGORIES.map(
          (category) => category.name,
        ),
        ...categoryNames,
      ]),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const productName =
        isTamil && product.tamil_name
          ? product.tamil_name
          : product.name;

      const searchValue = searchText
        .trim()
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        productName
          .toLowerCase()
          .includes(searchValue) ||
        product.name
          .toLowerCase()
          .includes(searchValue) ||
        (product.tamil_name || "")
          .toLowerCase()
          .includes(searchValue) ||
        (product.description || "")
          .toLowerCase()
          .includes(searchValue) ||
        getCategoryName(product)
          .toLowerCase()
          .includes(searchValue);

      const matchesColour =
        selectedColour === "all" ||
        getColour(product).toLowerCase() ===
          selectedColour.toLowerCase();

      const matchesCategory =
        selectedCategory === "all" ||
        getCategoryName(product).toLowerCase() ===
          selectedCategory.toLowerCase() ||
        getCategoryName(product)
          .toLowerCase()
          .replace(/s$/, "") ===
          selectedCategory
            .toLowerCase()
            .replace(/s$/, "");

      const productPrice = getPrice(product);

      const matchesMinimumPrice =
        minimumPrice === "" ||
        productPrice >= Number(minimumPrice);

      const matchesMaximumPrice =
        maximumPrice === "" ||
        productPrice <= Number(maximumPrice);

      return (
        matchesSearch &&
        matchesColour &&
        matchesCategory &&
        matchesMinimumPrice &&
        matchesMaximumPrice
      );
    });

    if (sortOption === "price-low-high") {
      return [...filtered].sort(
        (firstProduct, secondProduct) =>
          getPrice(firstProduct) -
          getPrice(secondProduct),
      );
    }

    if (sortOption === "price-high-low") {
      return [...filtered].sort(
        (firstProduct, secondProduct) =>
          getPrice(secondProduct) -
          getPrice(firstProduct),
      );
    }

    if (sortOption === "name-a-z") {
      return [...filtered].sort((firstProduct, secondProduct) =>
        firstProduct.name.localeCompare(
          secondProduct.name,
        ),
      );
    }

    if (sortOption === "stock-high-low") {
      return [...filtered].sort(
        (firstProduct, secondProduct) =>
          getStock(secondProduct) -
          getStock(firstProduct),
      );
    }

    return filtered;
  }, [
    products,
    searchText,
    selectedColour,
    selectedCategory,
    minimumPrice,
    maximumPrice,
    sortOption,
    isTamil,
  ]);

  const addToCart = (product: Product) => {
    const stock = getStock(product);

    if (stock <= 0) {
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  item.stock,
                ),
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          productId: product.id,
          name: product.name,
          tamilName: product.tamil_name,
          imageUrl: getImageUrl(product),
          price: getPrice(product),
          colour: getColour(product),
          quantity: 1,
          stock,
        },
      ];
    });

    setAddedProductId(product.id);

    window.setTimeout(() => {
      setAddedProductId(null);
    }, 1200);
  };

  const increaseQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                item.stock,
              ),
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.productId !== productId,
      ),
    );
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedColour("all");
    setSelectedCategory("all");
    setMinimumPrice("");
    setMaximumPrice("");
    setSortOption("default");
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0,
  );


  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf7f0] text-[#26221d]">
      {/* Top information strip */}
      <div className="bg-[#26221d] text-[#f4eee5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <a
            href={GOOGLE_MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-orange-300"
          >
            <span>📍</span>
            <span>{SHOP_ADDRESS}</span>
          </a>

          <div className="flex flex-wrap items-center gap-4">
            <span>🕘 9 AM – 9 PM</span>

            <span className="rounded-full bg-orange-500/15 px-3 py-1 font-semibold text-orange-300">
              Friday Holiday
            </span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#e8dfd2] bg-[#fbf7f0]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-2xl font-black text-white shadow-lg shadow-orange-200">
              N
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold tracking-tight">
                Nandhini Agency
              </p>

              <p className="hidden text-xs font-medium text-[#8a8177] sm:block">
                Wholesale Plastic Products
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#4a443c] lg:flex">
            <Link
              href="/"
              className="transition hover:text-orange-600"
            >
              Home
            </Link>

            <span className="text-orange-600">
              Products
            </span>

            <a
              href="#shop-products"
              className="transition hover:text-orange-600"
            >
              Shop
            </a>

            <a
              href="#order-info"
              className="transition hover:text-orange-600"
            >
              Order Information
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() =>
                setLanguage(isTamil ? "en" : "ta")
              }
              className="rounded-full border border-[#ddd4c7] bg-white px-4 py-2.5 text-sm font-bold transition hover:border-orange-300 hover:text-orange-600"
            >
              {isTamil ? "English" : "தமிழ்"}
            </button>

            <button
              type="button"
              onClick={() => setShowCart(true)}
              className="relative rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              <span className="hidden sm:inline">
                {isTamil ? "கார்ட்" : "Cart"}
              </span>

              <span className="sm:hidden">🛒</span>

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#26221d] px-1.5 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#ece5d8]">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-amber-200/35 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-20">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#746b61] transition hover:text-orange-600"
            >
              <span>←</span>
              {isTamil
                ? "முகப்பு பக்கத்திற்கு திரும்பு"
                : "Back to Home"}
            </Link>

            <span className="mt-7 flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
              <span className="h-2 w-2 rounded-full bg-orange-500" />

              {isTamil
                ? "மொத்த விலை பொருட்கள்"
                : "Wholesale Product Catalogue"}
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {isTamil ? (
                <>
                  உங்கள் தேவைக்கான{" "}
                  <span className="font-serif italic text-orange-600">
                    தரமான பொருட்கள்
                  </span>
                </>
              ) : (
                <>
                  Everyday products at{" "}
                  <span className="font-serif italic text-orange-600">
                    honest prices.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#746b61] sm:text-lg">
              {isTamil
                ? "தேவையான பொருட்களை தேர்வு செய்து, முன்பணம் செலுத்தி, உங்களுக்கு ஏற்ற நேரத்தில் கடையில் பெற்றுக்கொள்ளுங்கள்."
                : "Browse useful household plastic products, complete your prepaid order and collect it at your scheduled pickup time."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#shop-products"
                className="rounded-full bg-orange-600 px-6 py-3.5 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1 hover:bg-orange-700"
              >
                {isTamil
                  ? "பொருட்களை பார்க்கவும்"
                  : "Browse Products"}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-600 px-6 py-3.5 font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-1 hover:bg-green-700"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white bg-white/70 p-6 shadow-[0_30px_90px_rgba(60,45,30,0.14)] backdrop-blur">
            <div className="grid grid-cols-2 gap-4">
              {PRODUCT_CATEGORIES.slice(0, 6).map(
                (category, index) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category.name,
                      )
                    }
                    className={`group rounded-[1.5rem] border border-[#ece5d8] p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${
                      index === 0
                        ? "bg-blue-50"
                        : index === 1
                          ? "bg-red-50"
                          : index === 2
                            ? "bg-emerald-50"
                            : index === 3
                              ? "bg-amber-50"
                              : index === 4
                                ? "bg-lime-50"
                                : "bg-pink-50"
                    }`}
                  >
                    <span className="text-4xl">
                      {category.icon}
                    </span>

                    <p className="mt-4 font-black">
                      {isTamil
                        ? category.tamilName
                        : category.name}
                    </p>

                    <p className="mt-1 text-xs text-[#8a8177]">
                      {isTamil
                        ? category.name
                        : "View products"}
                    </p>
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Order information */}
      <section
        id="order-info"
        className="mx-auto max-w-7xl px-5 py-8 lg:px-8"
      >
        <div className="grid overflow-hidden rounded-[2rem] border border-[#ece5d8] bg-white shadow-[0_18px_60px_rgba(60,45,30,0.07)] md:grid-cols-3">
          <div className="flex gap-4 border-b border-[#ece5d8] p-6 md:border-b-0 md:border-r">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              💳
            </span>

            <div>
              <p className="font-black">
                {isTamil
                  ? "முன்பணம்"
                  : "Prepaid Orders"}
              </p>

              <p className="mt-1 text-sm leading-6 text-[#746b61]">
                {isTamil
                  ? "ஆர்டரை உறுதி செய்ய ஆன்லைனில் பணம் செலுத்தவும்."
                  : "Complete payment online to confirm your order."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-b border-[#ece5d8] p-6 md:border-b-0 md:border-r">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              📅
            </span>

            <div>
              <p className="font-black">
                {isTamil
                  ? "பிக்கப் நேரம்"
                  : "Scheduled Pickup"}
              </p>

              <p className="mt-1 text-sm leading-6 text-[#746b61]">
                {isTamil
                  ? "உங்களுக்கு ஏற்ற நேரத்தில் கடையில் பெற்றுக்கொள்ளுங்கள்."
                  : "Choose a convenient time to collect from the shop."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              🚚
            </span>

            <div>
              <p className="font-black">
                {isTamil
                  ? "டெலிவரி விசாரணை"
                  : "Delivery Enquiry"}
              </p>

              <p className="mt-1 text-sm leading-6 text-[#746b61]">
                {isTamil
                  ? "தூரம் மற்றும் கட்டணத்திற்கு WhatsApp மூலம் தொடர்புகொள்ளவும்."
                  : "Contact through WhatsApp for availability and charges."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section
        id="shop-products"
        className="mx-auto max-w-7xl px-5 pb-24 pt-8 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filter sidebar */}
          <aside className="h-fit rounded-[2rem] border border-[#ece5d8] bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                {isTamil
                  ? "வடிகட்டிகள்"
                  : "Filters"}
              </h2>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                {isTamil
                  ? "அனைத்தையும் நீக்கு"
                  : "Clear all"}
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-black"
              >
                {isTamil
                  ? "பொருள் தேடல்"
                  : "Search Products"}
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  id="search"
                  type="text"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder={
                    isTamil
                      ? "பெயரை உள்ளிடவும்"
                      : "Enter product name"
                  }
                  className="w-full rounded-2xl border border-[#ddd4c7] bg-[#fffdf9] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa197] focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-black"
              >
                {isTamil ? "வகை" : "Category"}
              </label>

              <select
                id="category"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="w-full rounded-2xl border border-[#ddd4c7] bg-[#fffdf9] px-4 py-3 text-sm outline-none focus:border-orange-400"
              >
                <option value="all">
                  {isTamil
                    ? "அனைத்து வகைகளும்"
                    : "All Categories"}
                </option>

                {availableCategories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label
                htmlFor="colour"
                className="mb-2 block text-sm font-black"
              >
                {isTamil ? "நிறம்" : "Colour"}
              </label>

              <select
                id="colour"
                value={selectedColour}
                onChange={(event) =>
                  setSelectedColour(event.target.value)
                }
                className="w-full rounded-2xl border border-[#ddd4c7] bg-[#fffdf9] px-4 py-3 text-sm outline-none focus:border-orange-400"
              >
                <option value="all">
                  {isTamil
                    ? "அனைத்து நிறங்களும்"
                    : "All Colours"}
                </option>

                {colours.map((colour) => (
                  <option key={colour} value={colour}>
                    {colour}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <p className="mb-2 block text-sm font-black">
                {isTamil
                  ? "விலை வரம்பு"
                  : "Price Range"}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  value={minimumPrice}
                  onChange={(event) =>
                    setMinimumPrice(event.target.value)
                  }
                  placeholder={
                    isTamil ? "குறைந்த" : "Min"
                  }
                  className="w-full rounded-2xl border border-[#ddd4c7] bg-[#fffdf9] px-4 py-3 text-sm outline-none focus:border-orange-400"
                />

                <input
                  type="number"
                  min="0"
                  value={maximumPrice}
                  onChange={(event) =>
                    setMaximumPrice(event.target.value)
                  }
                  placeholder={
                    isTamil ? "அதிக" : "Max"
                  }
                  className="w-full rounded-2xl border border-[#ddd4c7] bg-[#fffdf9] px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
              </div>
            </div>
          </aside>

          {/* Product area */}
          <div>
            <div className="flex flex-col gap-4 rounded-[2rem] border border-[#ece5d8] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-orange-600">
                  {isTamil
                    ? "கிடைக்கக்கூடிய பொருட்கள்"
                    : "Available Catalogue"}
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {isTamil ? "பொருட்கள்" : "Products"}
                </h2>

                {!loading && !error && (
                  <p className="mt-1 text-sm text-[#8a8177]">
                    {filteredProducts.length}{" "}
                    {isTamil
                      ? "பொருட்கள் கிடைக்கின்றன"
                      : "products found"}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="sort"
                  className="text-sm font-bold text-[#746b61]"
                >
                  {isTamil
                    ? "வரிசைப்படுத்து:"
                    : "Sort:"}
                </label>

                <select
                  id="sort"
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value)
                  }
                  className="rounded-full border border-[#ddd4c7] bg-[#fffdf9] px-4 py-2.5 text-sm font-semibold outline-none focus:border-orange-400"
                >
                  <option value="default">
                    {isTamil
                      ? "இயல்புநிலை"
                      : "Default"}
                  </option>

                  <option value="price-low-high">
                    {isTamil
                      ? "விலை: குறைவு முதல் அதிகம்"
                      : "Price: Low to High"}
                  </option>

                  <option value="price-high-low">
                    {isTamil
                      ? "விலை: அதிகம் முதல் குறைவு"
                      : "Price: High to Low"}
                  </option>

                  <option value="name-a-z">
                    {isTamil
                      ? "பெயர்: A முதல் Z"
                      : "Name: A to Z"}
                  </option>

                  <option value="stock-high-low">
                    {isTamil
                      ? "அதிக கையிருப்பு"
                      : "Highest Stock"}
                  </option>
                </select>
              </div>
            </div>

            {loading && (
              <div className="grid gap-6 pt-8 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[2rem] border border-[#ece5d8] bg-white"
                    >
                      <div className="h-64 animate-pulse bg-[#f1ebe2]" />

                      <div className="space-y-4 p-6">
                        <div className="h-4 w-24 animate-pulse rounded bg-[#eee6da]" />
                        <div className="h-6 w-3/4 animate-pulse rounded bg-[#eee6da]" />
                        <div className="h-4 w-full animate-pulse rounded bg-[#eee6da]" />
                        <div className="h-12 w-full animate-pulse rounded-2xl bg-[#eee6da]" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {!loading && error && (
              <div className="mt-8 rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center">
                <p className="text-4xl">⚠️</p>

                <h3 className="mt-4 text-xl font-black text-red-800">
                  {isTamil
                    ? "பொருட்களை ஏற்ற முடியவில்லை"
                    : "Unable to load products"}
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-700">
                  {error}
                </p>

                <p className="mt-4 text-sm text-red-700">
                  Make sure the FastAPI backend is
                  running at{" "}
                  <strong>
                    http://127.0.0.1:8000
                  </strong>
                  .
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-6 rounded-full bg-red-700 px-6 py-3 font-bold text-white"
                >
                  {isTamil
                    ? "மீண்டும் முயற்சிக்கவும்"
                    : "Try Again"}
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              filteredProducts.length === 0 && (
                <div className="mt-8 rounded-[2rem] border border-[#ece5d8] bg-white px-6 py-20 text-center">
                  <p className="text-6xl">📦</p>

                  <h3 className="mt-5 text-2xl font-black">
                    {isTamil
                      ? "பொருட்கள் கிடைக்கவில்லை"
                      : "No products found"}
                  </h3>

                  <p className="mt-2 text-[#746b61]">
                    {isTamil
                      ? "வேறு தேடல் அல்லது வடிகட்டலை முயற்சிக்கவும்."
                      : "Try changing your search or filters."}
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-full bg-orange-600 px-6 py-3 font-black text-white"
                  >
                    {isTamil
                      ? "வடிகட்டிகளை நீக்கு"
                      : "Clear Filters"}
                  </button>
                </div>
              )}

            {!loading &&
              !error &&
              filteredProducts.length > 0 && (
                <div className="grid gap-6 pt-8 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const price = getPrice(product);
                    const stock = getStock(product);
                    const colour =
                      getColour(product);
                    const size = getSize(product);
                    const imageUrl =
                      getImageUrl(product);

                    const productName =
                      isTamil && product.tamil_name
                        ? product.tamil_name
                        : product.name;

                    const isAdded =
                      addedProductId === product.id;

                    const isLowStock =
                      stock > 0 && stock <= 5;

                    return (
                      <article
                        key={product.id}
                        className="group overflow-hidden rounded-[2rem] border border-[#ece5d8] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(60,45,30,0.13)]"
                      >
                        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-[#fff9f2] to-[#f6ede1] p-6">
                          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-orange-700 shadow-sm backdrop-blur">
                            <span>
                              {getCategoryIcon(product)}
                            </span>

                            {getCategoryName(product)}
                          </div>

                          <div
                            className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1.5 text-xs font-black shadow-sm ${
                              stock <= 0
                                ? "bg-red-100 text-red-700"
                                : isLowStock
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {stock <= 0
                              ? isTamil
                                ? "கையிருப்பு இல்லை"
                                : "Out of Stock"
                              : isLowStock
                                ? isTamil
                                  ? `மீதம் ${stock}`
                                  : `Only ${stock} left`
                                : isTamil
                                  ? `${stock} கையிருப்பு`
                                  : `${stock} in stock`}
                          </div>

                          <img
                            src={imageUrl}
                            alt={productName}
                            className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div className="p-6">
                          <p className="text-xs font-black uppercase tracking-[0.15em] text-orange-600">
                            {getCategoryName(product)}
                          </p>

                          <h3 className="mt-2 line-clamp-2 min-h-14 text-xl font-black leading-7">
                            {productName}
                          </h3>

                          {isTamil &&
                            product.tamil_name && (
                              <p className="mt-1 text-xs text-[#8a8177]">
                                {product.name}
                              </p>
                            )}

                          <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-[#746b61]">
                            {product.description ||
                              (isTamil
                                ? "தினசரி பயன்பாட்டிற்கான தரமான பிளாஸ்டிக் பொருள்."
                                : "Quality plastic product for everyday use.")}
                          </p>

                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-[#fbf7f0] p-3">
                              <p className="text-xs text-[#8a8177]">
                                {isTamil
                                  ? "நிறம்"
                                  : "Colour"}
                              </p>

                              <p className="mt-1 truncate text-sm font-black">
                                {colour}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-[#fbf7f0] p-3">
                              <p className="text-xs text-[#8a8177]">
                                {isTamil
                                  ? "அளவு"
                                  : "Size"}
                              </p>

                              <p className="mt-1 truncate text-sm font-black">
                                {size}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-xs font-medium text-[#8a8177]">
                                {isTamil
                                  ? "விலை"
                                  : "Price"}
                              </p>

                              <p className="mt-1 text-2xl font-black text-orange-600">
                                ₹
                                {price.toLocaleString(
                                  "en-IN",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  },
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                addToCart(product)
                              }
                              disabled={stock <= 0}
                              className={`rounded-full px-5 py-3 text-sm font-black text-white transition ${
                                isAdded
                                  ? "bg-green-600"
                                  : "bg-[#26221d] hover:-translate-y-1 hover:bg-orange-600"
                              } disabled:cursor-not-allowed disabled:bg-[#cfc7bc]`}
                            >
                              {stock <= 0
                                ? isTamil
                                  ? "கையிருப்பு இல்லை"
                                  : "Out of Stock"
                                : isAdded
                                  ? isTamil
                                    ? "சேர்க்கப்பட்டது ✓"
                                    : "Added ✓"
                                  : isTamil
                                    ? "கார்ட்டில் சேர்"
                                    : "Add to Cart"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#26221d] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-2xl font-black">
                N
              </div>

              <div>
                <p className="font-black">
                  Nandhini Agency
                </p>

                <p className="text-xs text-white/50">
                  Wholesale Plastic Products
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/55">
              Affordable household plastic products
              for homes, shops and businesses.
            </p>
          </div>

          <div>
            <h3 className="font-black">Quick Links</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/55">
              <Link
                href="/"
                className="hover:text-orange-400"
              >
                Home
              </Link>

              <Link
                href="/products"
                className="hover:text-orange-400"
              >
                Products
              </Link>

              <a
                href="#shop-products"
                className="hover:text-orange-400"
              >
                Shop Catalogue
              </a>

              <a
                href="#order-info"
                className="hover:text-orange-400"
              >
                Order Information
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-black">
              Shop Information
            </h3>

            <div className="mt-5 space-y-3 text-sm leading-6 text-white/55">
              <p>Open: 9 AM – 9 PM</p>
              <p>Weekly holiday: Friday</p>
              <p>Prepaid scheduled pickup</p>
            </div>
          </div>

          <div>
            <h3 className="font-black">Contact</h3>

            <div className="mt-5 space-y-3 text-sm leading-6 text-white/55">
              <a
                href={`tel:+${PHONE_NUMBER}`}
                className="block hover:text-orange-400"
              >
                📞 {DISPLAY_PHONE_NUMBER}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-green-400"
              >
                💬 {DISPLAY_WHATSAPP_NUMBER}
              </a>

              <p>
                📍 12/56, Thiruvalluvar Street,
                <br />
                MGR Nagar, Chennai – 600078
              </p>

              <a
                href={GOOGLE_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-orange-400 hover:text-orange-300"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-5 text-sm text-white/40 sm:flex-row lg:px-8">
            <p>
              © 2026 Nandhini Agency. All rights
              reserved.
            </p>

            <p>MGR Nagar, Chennai – 600078</p>
          </div>
        </div>
      </footer>

      {/* Floating contact buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
        <a
          href={`tel:+${PHONE_NUMBER}`}
          aria-label="Call Nandhini Agency"
          className="flex items-center justify-center gap-2 rounded-full bg-[#26221d] px-5 py-3 text-sm font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-600"
        >
          <span>📞</span>
          <span className="hidden sm:inline">Call</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Nandhini Agency"
          className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-green-700"
        >
          <span>💬</span>
          <span className="hidden sm:inline">
            WhatsApp
          </span>
        </a>
      </div>

      {/* Cart drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#26221d]/50 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setShowCart(false)}
            className="absolute inset-0"
          />

          <aside className="relative z-10 h-full w-full max-w-lg overflow-y-auto bg-[#fffdf9] shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-[#ece5d8] bg-[#fffdf9]/95 px-6 py-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-orange-600">
                    Nandhini Agency
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    {isTamil
                      ? "உங்கள் கார்ட்"
                      : "Your Cart"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCart(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd4c7] bg-white font-black transition hover:bg-orange-50 hover:text-orange-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-5xl">
                    🛒
                  </div>

                  <h3 className="mt-6 text-xl font-black">
                    {isTamil
                      ? "உங்கள் கார்ட் காலியாக உள்ளது"
                      : "Your cart is empty"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#746b61]">
                    {isTamil
                      ? "பொருட்களை தேர்வு செய்து கார்ட்டில் சேர்க்கவும்."
                      : "Browse products and add the items you need."}
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowCart(false)}
                    className="mt-6 rounded-full bg-orange-600 px-6 py-3 font-black text-white"
                  >
                    {isTamil
                      ? "பொருட்களை பார்க்கவும்"
                      : "Browse Products"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="rounded-[1.5rem] border border-[#ece5d8] bg-white p-4"
                      >
                        <div className="flex gap-4">
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fbf7f0] p-2">
                            <img
                              src={item.imageUrl}
                              alt={
                                isTamil &&
                                item.tamilName
                                  ? item.tamilName
                                  : item.name
                              }
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 font-black">
                              {isTamil &&
                              item.tamilName
                                ? item.tamilName
                                : item.name}
                            </h3>

                            <p className="mt-1 text-xs text-[#8a8177]">
                              {isTamil
                                ? "நிறம்"
                                : "Colour"}
                              : {item.colour}
                            </p>

                            <p className="mt-2 text-lg font-black text-orange-600">
                              ₹
                              {item.price.toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.productId,
                              )
                            }
                            aria-label="Remove product"
                            className="h-fit text-sm font-bold text-red-600 hover:underline"
                          >
                            {isTamil
                              ? "நீக்கு"
                              : "Remove"}
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-[#ece5d8] pt-4">
                          <div className="flex items-center overflow-hidden rounded-full border border-[#ddd4c7]">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.productId,
                                )
                              }
                              className="px-4 py-2 font-black transition hover:bg-orange-50"
                            >
                              −
                            </button>

                            <span className="min-w-10 px-2 text-center font-black">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.productId,
                                )
                              }
                              disabled={
                                item.quantity >=
                                item.stock
                              }
                              className="px-4 py-2 font-black transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:text-[#cfc7bc]"
                            >
                              +
                            </button>
                          </div>

                          <p className="font-black">
                            ₹
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-[#ece5d8] bg-white p-5">
                    <div className="flex items-center justify-between text-sm text-[#746b61]">
                      <span>
                        {isTamil
                          ? "பொருட்கள்"
                          : "Items"}
                      </span>

                      <span className="font-bold text-[#26221d]">
                        {cartCount}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#ece5d8] pt-4">
                      <span className="text-lg font-black">
                        {isTamil
                          ? "மொத்தம்"
                          : "Total"}
                      </span>

                      <span className="text-2xl font-black text-orange-600">
                        ₹
                        {cartTotal.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem(
                          "nandhini-agency-cart",
                          JSON.stringify(cart),
                        );
                        setShowCart(false);
                        router.push("/checkout");
                      }}
                      className="mt-5 w-full rounded-full bg-orange-600 px-6 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
                    >
                      {isTamil
                        ? "ஆர்டரை தொடரவும்"
                        : "Continue Order"}
                    </button>

                    <p className="mt-3 text-center text-xs leading-5 text-[#8a8177]">
                      {isTamil
                        ? "பணம் செலுத்துதல் மற்றும் பிக்கப் நேரம் அடுத்த கட்டத்தில் சேர்க்கப்படும்."
                        : "Payment and pickup scheduling will be connected in the next step."}
                    </p>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#fbf7f0]">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />

            <p className="mt-4 font-bold text-[#746b61]">
              Loading products...
            </p>
          </div>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}