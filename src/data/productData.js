export const sampleProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'WH-1000XM4',
    price: 349.99,
    salePrice: 299.99,
    cost: 150,
    stock: 45,
    weight: 0.25,
    category: 'electronics',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1547721064-da6cfb341d50?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    variants: [
      { name: 'color', options: ['black', 'silver', 'blue'] }
    ]
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with health monitoring',
    sku: 'SW-PRO-2023',
    price: 199.99,
    salePrice: 0,
    cost: 90,
    stock: 32,
    weight: 0.15,
    category: 'electronics',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    variants: [
      { name: 'color', options: ['black', 'rose gold'] },
      { name: 'size', options: ['38mm', '42mm'] }
    ]
  },
  // Add more sample products...
];

export default sampleProducts;