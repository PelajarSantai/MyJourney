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
import TravelCard from "../../components/TravelCard";

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



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>My Travel Journal 🌍</Text>
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
          renderItem={({ item }) => (
            <TravelCard
              title={item.title}
              description={item.description}
              date={new Date(item.visitedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: "#888", fontStyle: "italic" }}>
                Belum ada riwayat, coba tambah dulu.
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
    backgroundColor: "#F8F9FA",
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
