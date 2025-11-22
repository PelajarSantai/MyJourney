import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: Untuk Mobile mengambil semua daftar catatan
export async function GET() {
  try {
    const logs = await prisma.travelLog.findMany({
      orderBy: { createdAt: 'desc' }, // Urutkan dari yang paling baru
    });
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// 2. POST: Untuk Mobile mengirim data baru (Judul, Lokasi, dll)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, latitude, longitude } = body;

    // Validasi: Judul dan Lokasi tidak boleh kosong
    if (!title || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Data tidak lengkap (Butuh: title, lat, long)' },
        { status: 400 }
      );
    }

    // Simpan ke Database MyJourney
    const newLog = await prisma.travelLog.create({
      data: {
        title,
        description,
        latitude: parseFloat(latitude), // Ubah text jadi angka desimal
        longitude: parseFloat(longitude),
      },
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("Error backend:", error);
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}