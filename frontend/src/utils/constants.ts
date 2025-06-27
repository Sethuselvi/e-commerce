export const DEFAULT_PRODUCT_IMAGE = '/images/default-product.svg';

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
}; 