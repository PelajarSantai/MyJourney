import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";

// Struktur data mengikuti payload API logs saat ini
interface TravelLog {
  id: number;
  title: string;
  description: string | null;
  visitedAt: string;
}

export default function HomeScreen() {
  // State utama untuk data logs dan status UI
  const [logs, setLogs] = useState<TravelLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Endpoint backend (khusus emulator Android)
  const API_URL = "http://10.0.2.2:3000/api/logs";

  // Request data logs dari backend
  // loading & refreshing dikontrol dari sini agar konsisten
  const fetchLogs = async () => {
    try {
      const response = await axios.get(API_URL);
      setLogs(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // fetch pertama kali saat screen dirender
  useEffect(() => {
    fetchLogs();
  }, []);

  // handler refresh dari gesture pull-down
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLogs();
  }, []);

  const renderItem = ({ item }: { item: TravelLog }) => (
    <View style={styles.card}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>{item.title}</Text>
        {/* tanggal ditampilkan dalam format lokal (id-ID) agar lebih mudah dibaca */}
        <Text style={styles.date}>
          {new Date(item.visitedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>

      <Text style={styles.description}>
        {item.description || "Tidak ada deskripsi"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>MyJourney ✈️</Text>
        <Text style={styles.headerSubtitle}>Rekam jejak petualanganmu</Text>
      </View>

      {/* Switch tampilan berdasarkan status loading */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Sedang memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // Menampilkan pesan informatif jika belum ada data riwayat
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: "#888", fontStyle: "italic" }}>
                Belum ada riwayat perjalanan.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: "#444",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
});
