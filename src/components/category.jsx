import { FaStar } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

const CategorySection = () => {
  const categories = [
    {
      name: "Smart Devices",
      products: [
        {
          name: "Smart Speaker",
          image:
            "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&auto=format",
          intro: "Voice assistant compatible smart speaker",
          price: 49.99,
          rating: 4,
        },
        {
          name: "Smart Display",
          image:
            "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&auto=format",
          intro: "Control hub with touchscreen",
          price: 89.99,
          rating: 5,
        },
      ],
    },
    {
      name: "Lighting",
      products: [
        {
          name: "Smart Bulb",
          image:
            "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&auto=format",
          intro: "Color-changing LED bulb with app control",
          price: 19.99,
          rating: 4,
        },
        {
          name: "Ambient Light Strip",
          image:
            "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&auto=format",
          intro: "Mood lighting for any room",
          price: 29.99,
          rating: 5,
        },
      ],
    },
    {
      name: "Security",
      products: [
        {
          name: "Smart Doorbell",
          image:
            "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&auto=format",
          intro: "HD camera with two-way audio",
          price: 99.99,
          rating: 5,
        },
        {
          name: "Wi-Fi Camera",
          image:
            "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&auto=format",
          intro: "Indoor surveillance with motion detection",
          price: 59.99,
          rating: 4,
        },
      ],
    },
  ];

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <h3 className="text-xl font-semibold mb-4">{cat.name}</h3>
            <div className="space-y-4">
              {cat.products.map((product, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 shadow-sm bg-white"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h4 className="mt-2 font-bold">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.intro}</p>
                  <div className="flex items-center text-yellow-500 mt-1">
                    {[...Array(product.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-600 font-semibold">
                      ${product.price}
                    </span>
                    <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
                      <FaShoppingCart className="inline mr-1" /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategorySection;
