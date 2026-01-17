import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

// 1. FUNGSI GET (Untuk HP mengambil data)
export async function GET() {
  try {
    const logs = await prisma.travelLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { photos: true }
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// 2. FUNGSI POST (Untuk HP mengirim/simpan data)
export async function POST(request: Request) {
  try {
    // Membaca data form (multipart/form-data)
    const formData = await request.formData();

    // Ambil data teks
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);

    // Validasi sederhana
    if (!title || !latitude || !longitude) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Ambil data file (gambar) - bisa banyak gambar
    const files = formData.getAll("photos") as File[];
    const savedPhotos = [];

    // Loop setiap file untuk disimpan ke folder
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // Buat nama file unik (contoh: 173456789-kucing.jpg)
      const filename = Date.now() + "-" + file.name.replaceAll(" ", "_");

      // Simpan ke folder public/uploads
      await writeFile(
        path.join(process.cwd(), "public/uploads", filename),
        buffer
      );

      // Simpan path-nya untuk database
      savedPhotos.push({ url: `/uploads/${filename}` });
    }

    // Simpan data ke Database PostgreSQL
    const newLog = await prisma.travelLog.create({
      data: {
        title,
        description,
        latitude,
        longitude,
        photos: {
          create: savedPhotos // Simpan relasi foto sekaligus
        }
      },
      include: { photos: true }
    });

    return NextResponse.json({ message: "Berhasil disimpan", data: newLog }, { status: 201 });

  } catch (error) {
    console.error(error); // Tampilkan error di terminal server jika ada
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}