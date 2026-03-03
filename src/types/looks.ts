export type LookProduct = {
  shopifyProductId: string;
  shopifyHandle: string;
  title: string;
  price: string;
  productUrl: string;
  selectedImageUrl: string;
  selectedImageAlt: string;
  comingSoon: boolean;
};

export type Look = {
  id: string;
  label: string;
  title: string;
  heroImage: string;
  heroImageAlt: string;
  products: LookProduct[];
};

export type LooksData = {
  looks: Look[];
};
