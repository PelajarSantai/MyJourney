import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';

interface TravelLog {
  id: number;
  title: string;
  description: string | null;
  visitedAt: string;
}

export default function HomeScreen() {
  const [logs, setLogs] = useState<TravelLog[]>([]);
  const [loading, setLoading] = useState(true); // State untuk loading
  const [refreshing, setRefreshing] = useState(false);

  // Data dummy masih kita simpan sebentar
  const dummyData = [
    { id: 1, title: 'Liburan ke Bali', description: 'Jalan-jalan di pantai kuta melihat sunset' },
    { id: 2, title: 'Kuliner Bandung', description: 'Mencoba seblak dan batagor di alun-alun' },
  ];

  const fetchLogs = async () => {
    try {
      // Kode debug yang panjang kita hapus, ganti yang bersih
      const response = await axios.get('http://10.0.2.2:3000/api/logs');
      setLogs(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      // Matikan loading selesai request
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLogs();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>MyJourney ✈️</Text>
        <Text style={styles.headerSubtitle}>Rekam jejak petualanganmu</Text>
      </View>

      {/* LOGIKA BARU: Tampilkan Loading jika belum siap */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10, color: '#666' }}>Memuat data...</Text>
        </View>
      ) : (
        // Masih menampilkan dummyData
        <FlatList
          data={dummyData} 
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  headerContainer: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  listContent: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  headerCard: { marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '600', color: '#000' },
  description: { fontSize: 14, color: '#444' },
  // Style baru untuk posisi loading tengah
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
});