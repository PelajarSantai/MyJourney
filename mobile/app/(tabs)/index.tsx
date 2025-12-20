import React, { useEffect, useState } from 'react'; // Menambah useEffect & useState
import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList } from 'react-native';
import axios from 'axios'; // Import axios

// menyesuaikan interface dengan database
interface TravelLog {
  id: number;
  title: string;
  description: string | null;
  visitedAt: string;
}

export default function HomeScreen() {
  // STATE BARU: Buat nampung data asli nanti
  const [logs, setLogs] = useState<TravelLog[]>([]);

  // data dummy (masih dipake dulu buat tampilan)
  const dummyData = [
    { id: 1, title: 'Liburan ke Bali', description: 'Jalan-jalan di pantai kuta melihat sunset' },
    { id: 2, title: 'Kuliner Bandung', description: 'Mencoba seblak dan batagor di alun-alun' },
  ];

  // FUNGSI BARU: Logic ambil data (tapi belum dirender ke layar)
  const fetchLogs = async () => {
    try {
      // IP Emulator Android = 10.0.2.2
      const response = await axios.get('http://10.0.2.2:3000/api/logs');
      console.log("Data berhasil diambil:", response.data); // Cek di terminal
      setLogs(response.data);
    } catch (error) {
      console.error("Error ambil data:", error);
    }
  };

  // Panggil fungsi saat aplikasi dibuka
  useEffect(() => {
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

      {/* Masih pakai dummyData, jadi tampilan gak berubah */}
      <FlatList
        data={dummyData} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  // style baru untuk card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2, 
  },
  headerCard: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#444',
  },
});