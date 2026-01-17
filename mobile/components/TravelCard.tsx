import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface TravelCardProps {
  title: string;
  date: string;
  description: string | null;
  imageUrl?: string; // Nanti buat foto
}

export default function TravelCard({ title, date, description, imageUrl }: TravelCardProps) {
  return (
    <View style={styles.card}>
      {/* Jika ada gambar, tampilkan (sementara placeholder dulu kalo null) */}
      <View style={styles.imagePlaceholder}>
        <Text style={{ color: "#aaa" }}>No Image</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description || "Tidak ada deskripsi"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden", // Biar gambar gak keluar radius
    elevation: 3, // Shadow di Android
    shadowColor: "#000", // Shadow di iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
