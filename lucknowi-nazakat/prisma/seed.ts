import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  await prisma.product.deleteMany();

  const products = [
    {
      name: 'White Handcrafted Chikankari Anarkali Kurti',
      slug: 'white-chikankari-anarkali-kurti',
      description: 'Elegant white handcrafted lakhnavi chikankari Anarkali kurti featuring intricate hand embroidery on premium pure cotton fabric.',
      price: 3499,
      originalPrice: 4999,
      discountPercentage: 30,
      rating: 4.9,
      reviewCount: 28,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
      ],
      category: 'chikankari',
      stock: 15,
      isNewArrival: true,
      isBestSeller: true,
      isFeatured: true,
      isOnSale: true,
    },
    {
      name: 'Royal Lucknowi Embroidered Silk Kurta Set',
      slug: 'royal-lucknowi-silk-kurta-set',
      description: 'Luxurious silk kurta set embellished with shadow work chikankari and subtle mukaish highlights.',
      price: 5299,
      originalPrice: 6999,
      discountPercentage: 24,
      rating: 4.8,
      reviewCount: 19,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800'
      ],
      category: 'suits',
      stock: 10,
      isNewArrival: false,
      isBestSeller: true,
      isFeatured: true,
      isOnSale: false,
    },
    {
      name: 'Pastel Pink Georgette Chikankari Saree',
      slug: 'pastel-pink-georgette-chikankari-saree',
      description: 'Graceful pastel pink pure georgette saree embroidered with dense all-over Chikankari jaal.',
      price: 7999,
      originalPrice: 9999,
      discountPercentage: 20,
      rating: 5.0,
      reviewCount: 42,
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
      ],
      category: 'sarees',
      stock: 8,
      isNewArrival: true,
      isBestSeller: true,
      isFeatured: false,
      isOnSale: true,
    },
    {
      name: "Men's Classic Lakhnavi Chikankari White Kurta",
      slug: 'mens-chikankari-white-kurta',
      description: 'Traditional men Lakhnavi cotton kurta with delicate needlework across chest and mandarin collar.',
      price: 2999,
      originalPrice: 3999,
      discountPercentage: 25,
      rating: 4.8,
      reviewCount: 31,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800'
      ],
      category: 'men',
      stock: 20,
      isNewArrival: true,
      isBestSeller: false,
      isFeatured: true,
      isOnSale: false,
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });