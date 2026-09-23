const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products into database...');
  
  await prisma.product.deleteMany({});

  await prisma.product.createMany({
    data: [
      {
        id: '1',
        name: 'White Georgette Anarkali Kurti',
        description: 'Handcrafted Lucknowi Chikankari Anarkali Kurti in fine georgette fabric.',
        price: 4500,
        category: 'KURTIS',
        image: '/images/products/kurti-1.jpg',
        stock: 15,
      },
      {
        id: '2',
        name: 'Chicken Curry Kurta - Mustard Yellow',
        description: 'Authentic handcrafted Chikankari kurta in vibrant mustard yellow.',
        price: 3000,
        category: 'KURTIS',
        image: '/images/products/kurti-2.jpg',
        stock: 10,
      },
      {
        id: '3',
        name: 'Pastel Blue Chikankari Saree',
        description: 'Elegant Lucknowi Chikankari saree with intricate Bakhiya stitching.',
        price: 6500,
        category: 'SAREES',
        image: '/images/products/saree-1.jpg',
        stock: 8,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });