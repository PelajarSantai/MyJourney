import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from "react-native";

interface TravelCardProps {
  title: string;
  date: string;
  description: string | null;
  images?: string[]; // Array foto
  imageUrl?: string; // Legacy support (backup)
  latitude?: number;
  longitude?: number;
}

export default function TravelCard({ title, date, description, images, imageUrl, latitude, longitude }: TravelCardProps) {
  // Gabungkan logic: prioritaskan images array, kalau kosong pakai imageUrl, kalau kosong null
  const photoList = images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];

  return (
    <View style={styles.card}>
      {/* Tampilkan gambar horizontal scroll jika ada */}
      {photoList.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {photoList.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: "#aaa" }}>No Image</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description || "Tidak ada deskripsi"}
        </Text>

        {/* Link 360 Google Maps */}
        {latitude && longitude && (
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => {
              const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;
              Linking.openURL(url);
            }}
          >
            <Text style={styles.mapButtonText}>🌐 Lihat 360° di Lokasi</Text>
          </TouchableOpacity>
        )}
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
  imageScroll: {
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: 200, // Fixed width biar enak discroll
    height: 150,
    resizeMode: "cover",
    marginRight: 2, // Jarak antar foto
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
  mapButton: {
    marginTop: 12,
    backgroundColor: "#E3F2FD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  mapButtonText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
