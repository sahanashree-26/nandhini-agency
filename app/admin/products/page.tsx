"use client";

import { useState } from "react";
import { createProduct } from "@/lib/api";

export default function AdminProductsPage() {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [colour, setColour] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");

    if (!imageUrl.trim()) {
      setMessage("Please enter a product image URL.");
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        name: name.trim(),
        description: description.trim(),
        category_id: Number(categoryId),

        images: [
          {
            image_url: imageUrl.trim(),
            display_order: 1,
          },
        ],

        variants: [
          {
            sku: `SKU-${Date.now()}`,
            colour: colour.trim() || "Standard",
            size: "Standard",
            price: Number(price),
            stock: Number(stock),
          },
        ],
      });

      setMessage("Product added successfully!");

      setName("");
      setCategoryId("1");
      setColour("");
      setPrice("");
      setStock("");
      setDescription("");
      setImageUrl("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Add Product
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Add a new product to Nandhini Agency.
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-lg border border-orange-600 bg-white px-4 py-2 font-semibold text-orange-700 hover:bg-orange-50"
          >
            Back to Dashboard
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md md:p-8"
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Product Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Plastic Bucket"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Category
              </label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="1">Buckets</option>
                <option value="2">Mug</option>
                <option value="3">Mop</option>
                <option value="4">Broom Stick</option>
                <option value="5">Dustbin</option>
                <option value="6">Mirror</option>
                <option value="7">Ball</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="colour"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Colour
              </label>

              <input
                id="colour"
                type="text"
                value={colour}
                onChange={(event) => setColour(event.target.value)}
                placeholder="Example: Blue"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Price
                </label>

                <input
                  id="price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="Example: 250"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  placeholder="Example: 50"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Image URL
              </label>

              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/image.jpg"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                The backend currently requires at least one image.
              </p>
            </div>

            {imageUrl && (
              <div>
                <p className="mb-2 text-sm font-bold text-slate-800">
                  Image Preview
                </p>

                <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="max-h-64 max-w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter product details"
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {message && (
              <div
                className={`rounded-lg px-4 py-3 font-semibold ${
                  message.includes("successfully")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}