import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Purane dummy data clean karein
  await prisma.product.deleteMany({});

  // Naye Chikankari products insert karein
  await prisma.product.createMany({
    data: [
      {
        name: 'Chiken Curry Kurta - Mustard Yellow',
        slug: 'chiken-curry-kurta-yellow',
        description: 'Authentic Lucknowi Handcrafted Chikankari Cotton Kurta for Men.',
        price: 3000,
        originalPrice: 12000,
        discountPercentage: 75,
        rating: 4.8,
        reviewCount: 42,
        images: JSON.stringify(['https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=800']),
        category: 'men',
        stock: 15,
        isNewArrival: true,
        isBestSeller: true,
        isFeatured: true,
        isOnSale: true,
      },
      {
        name: 'White Georgette Anarkali Kurti',
        slug: 'white-georgette-anarkali',
        description: 'Elegant white lucknowi chikankari handcrafted georgette anarkali suit.',
        price: 4500,
        originalPrice: 9000,
        discountPercentage: 50,
        rating: 4.9,
        reviewCount: 88,
        images: JSON.stringify(['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800']),
        category: 'women',
        stock: 20,
        isNewArrival: true,
        isBestSeller: true,
        isFeatured: true,
        isOnSale: false,
      },
      {
        name: 'Lucknowi Modal Silk Chikankari Saree',
        slug: 'modal-silk-chikankari-saree',
        description: 'Royal maroon handcrafted Lucknowi Modal Silk Chikankari Saree with zari border.',
        price: 6800,
        originalPrice: 13600,
        discountPercentage: 50,
        rating: 4.7,
        reviewCount: 31,
        images: JSON.stringify(['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800']),
        category: 'sarees',
        stock: 8,
        isNewArrival: false,
        isBestSeller: true,
        isFeatured: true,
        isOnSale: true,
      },
    ],
  });

  console.log('✅ Database seeded successfully with Lucknowi Nazakat catalog!');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });