import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

// Helper untuk menghapus file gambar
async function deleteImageFile(url: string) {
    try {
        const filename = url.split("/uploads/")[1];
        if (!filename) return;

        const filepath = path.join(process.cwd(), "public/uploads", filename);
        await unlink(filepath);
    } catch (error) {
        console.error(`Gagal menghapus file ${url}:`, error);
    }
}

// 1. GET By ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const logId = parseInt(id);

        const log = await prisma.travelLog.findUnique({
            where: { id: logId },
            include: { photos: true },
        });

        if (!log) {
            return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(log);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// 2. PUT (Update Text Only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const logId = parseInt(id);

        // Parse body JSON
        const body = await request.json();
        const { title, description } = body;

        const updatedLog = await prisma.travelLog.update({
            where: { id: logId },
            data: {
                title,
                description,
            },
            include: { photos: true },
        });

        return NextResponse.json(updatedLog);
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Gagal mengupdate data" }, { status: 500 });
    }
}

// 3. DELETE
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const logId = parseInt(id);

        // 1. Ambil data dulu untuk dapat daftar foto
        const log = await prisma.travelLog.findUnique({
            where: { id: logId },
            include: { photos: true },
        });

        if (!log) {
            return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
        }

        // 2. Hapus file fisik gambar di server
        for (const photo of log.photos) {
            await deleteImageFile(photo.url);
        }

        // 3. Hapus data di database (Cascade akan menghapus data photo di DB)
        await prisma.travelLog.delete({
            where: { id: logId },
        });

        return NextResponse.json({ message: "Berhasil dihapus" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
    }
}
