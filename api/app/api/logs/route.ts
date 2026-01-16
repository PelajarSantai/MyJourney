import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// FUNGSI GET: Untuk HP mengambil daftar catatan perjalanan
export async function GET() {
  try {
    // Ambil semua data dari database, urutkan dari yang terbaru
    const logs = await prisma.travelLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { photos: true } // Sertakan data foto juga
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}