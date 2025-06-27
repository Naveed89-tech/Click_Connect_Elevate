const mockProducts = new Array(20).fill(null).map((_, index) => ({
  id: index + 1,
  name: `Apple iPhone ${index + 11} Pro 256GB`,
  price: 1399 + index * 50,
  image: `https://via.placeholder.com/400x300?text=iPhone+${index + 11}`,
  description: `This is the description for iPhone ${index + 11} Pro.`,
  category: index % 2 === 0 ? "Smartphone" : "Tablet",
}));

export default mockProducts;
