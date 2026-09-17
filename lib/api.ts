const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://nandhini-agency.onrender.com";

export type Category = {
  id: number;
  name: string;
  tamil_name: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch categories");
  }

  return response.json();
}

export type ProductImageCreate = {
  image_url: string;
  display_order: number;
};

export type ProductVariantCreate = {
  sku: string;
  colour: string;
  size: string;
  price: number;
  stock: number;
};

export type ProductCreate = {
  name: string;
  description: string;
  category_id: number;
  images: ProductImageCreate[];
  variants: ProductVariantCreate[];
};

type FastApiValidationError = {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
};

type ApiErrorResponse = {
  detail?: string | FastApiValidationError[];
};

export async function createProduct(product: ProductCreate) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;

    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `Unable to create product. Server returned ${response.status}.`,
      );
    }

    if (Array.isArray(errorData.detail)) {
      const errorMessage = errorData.detail
        .map((error) => {
          const field = error.loc
            ?.filter((item) => item !== "body")
            .join(" → ");

          const message = error.msg || "Invalid value";

          return field ? `${field}: ${message}` : message;
        })
        .join(", ");

      throw new Error(errorMessage);
    }

    if (typeof errorData.detail === "string") {
      throw new Error(errorData.detail);
    }

    throw new Error("Unable to create product");
  }

  return response.json();
}