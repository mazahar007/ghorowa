import type { AgeGroup, Gender } from "./labels";

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string;
  live: boolean;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  gender: Gender;
  ageGroups: AgeGroup[];
  price: number;
  compareAtPrice: number | null;
  sizes: string[];
  colors: string[];
  images: string[];
  description: string;
  details: string[];
  featured: boolean;
  inStock: boolean;
  createdAt: string;
};
