const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai seeding database...');

  // Hapus data lama (opsional, biar gak duplikat terus)
  await prisma.travelLog.deleteMany();
  console.log('🗑️  Data lama dibersihkan.');

  // Data 1: Bali
  const bali = await prisma.travelLog.create({
    data: {
      title: 'Liburan ke Bali 🌴',
      description: 'Seru banget main di pantai Kuta dan makan ayam betutu! Sunsetnya juara dunia.',
      latitude: -8.723796,
      longitude: 115.17677,
      visitedAt: new Date('2023-12-25'),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
          { url: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da' },
        ],
      },
    },
  });
  console.log(`✅ Created log: ${bali.title}`);

  // Data 2: Gunung Gede
  const gede = await prisma.travelLog.create({
    data: {
      title: 'Hiking Gunung Gede 🏔️',
      description: 'Capek tapi pemandangannya worth it parah, sunrise-nya di Suryakencana bikin nagih!',
      latitude: -6.790554,
      longitude: 106.980658,
      visitedAt: new Date('2024-01-01'),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1623945413009-0dcc9e6236b2' },
        ],
      },
    },
  });
  console.log(`✅ Created log: ${gede.title}`);

  // Data 3: Bandung
  const bandung = await prisma.travelLog.create({
    data: {
      title: 'Kulineran di Bandung 🍜',
      description: 'Cuanki, Batagor, Seblak... kenyang banget! Bandung emang surga kuliner.',
      latitude: -6.917464,
      longitude: 107.619123,
      visitedAt: new Date('2024-01-15'),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1606138676644-d8bc5d7c43df' },
        ],
      },
    },
  });
  console.log(`✅ Created log: ${bandung.title}`);

  console.log('🎉 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
