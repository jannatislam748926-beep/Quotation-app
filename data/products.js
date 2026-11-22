export const products = [
  {
    id: "prod-1",
    name: "Wireless Headphones",
    unitPrice: 45,
    image: "images.jpg",
  },
  {
    id: "prod-2",
    name: "Mechanical Keyboard",
    unitPrice: 80,
    image: "/images/default-product.png",
  },
  {
    id: "prod-3",
    name: "Smart Watch",
    unitPrice: 65,
    image: "/images/default-product.png",
  },
  {
    id: "prod-4",
    name: "USB-C Hub",
    unitPrice: 30,
    image: "/images/default-product.png",
  },
];

export const countries = ["UK", "USA", "China"];

export const countryRates = {
  UK: { shipping: 25, taxPercent: 15 },
  USA: { shipping: 30, taxPercent: 10 },
  China: { shipping: 12, taxPercent: 5 },
};