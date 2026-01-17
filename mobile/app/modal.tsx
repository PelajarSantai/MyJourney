/**
 * Halaman Buat Catatan (Modal)
 * Dibuat oleh: Member 2
 * Fitur: Form Input, Kamera, Lokasi, API Post
 */

// 1. React & React Native
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView, Platform } from 'react-native';

// 2. Expo Libraries
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 3. Utilities
import axios from 'axios';

// 4. Constants
// IP Emulator Android (Ganti kalau pakai HP fisik)
const API_URL = "http://10.0.2.2:3000/api/logs";

// Pesan-pesan dalam aplikasi
const MESSAGES = {
  validation: {
    title: "Mohon isi judul catatanmu dulu ya!",
    description: "Ceritain sedikit tentang perjalananmu!",
    image: "Wajib upload foto",
    location: "Jangan lupa ambil lokasi, agar tau ini dimana!",
  },
  system: {
    cameraPermission: 'Maaf, kami butuh izin akses kamera untuk fitur ini!',
    locationPermission: 'Izin lokasi ditolak! Tidak bisa mengambil koordinat.',
    success: 'Catatan berhasil disimpan!',
    error: 'Gagal menyimpan data!',
  },
};

// Konfigurasi Kamera
const CAMERA_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.7,
};

// Warna Tema (Supaya konsisten)
const COLORS = {
  primary: '#007AFF',
  secondary: '#e1f0ff',
  background: '#fff',
  text: '#333',
  textSecondary: '#666',
  border: '#ddd',
  inputBg: '#f9f9f9',
  white: '#fff',
  black: '#000',
};

export default function ModalScreen() {
  // Tipe data custom
  type LocationState = Location.LocationObject | null;
  type ImageState = string | null;

  // State untuk menyimpan input form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // State untuk data multimedia (foto & lokasi)
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationState>(null);
  
  // State UI
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Membuka galeri menggunakan Expo ImagePicker.
   * User perlu memberikan izin akses foto.
   */
  const pickImage = async () => {
    // 1. Minta Izin Galeri (Photo Library)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert("Maaf, kami butuh izin akses galeri untuk fitur ini!");
      return;
    }

    console.log("Izin galeri diberikan!");

    // 2. Buka Galeri
    const result = await ImagePicker.launchImageLibraryAsync({
      ...CAMERA_OPTIONS,
      allowsMultipleSelection: true,
      selectionLimit: 100, // Batas 100 foto
    });

    console.log(result);

    if (!result.canceled) {
      setImages(result.assets.map(asset => asset.uri));
    }
  };

  /**
   * Mengambil koordinat GPS saat ini menggunakan Expo Location.
   * Membutuhkan izin foreground location.
   */
  const getLocation = async () => {
    try {
      // 1. Minta Izin Lokasi
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        alert(MESSAGES.system.locationPermission);
        return;
      }

      console.log("Mencoba mengambil lokasi...");

      // 2. Strategi Bertingkat (Layered Strategy)
      
      // Tahap A: Coba ambil lokasi terakhir yang tersimpan (Cepat & Minim Error)
      let location = await Location.getLastKnownPositionAsync({});
      
      // Tahap B: Jika tidak ada last known, baru minta Current Position (Beban GPS)
      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced, // Balanced biar gak maksa GPS High Accuracy
        });
      }

      // Jika berhasil dapat lokasi
      if (location) {
        setLocation(location);
        console.log("Lokasi didapatkan:", location);
      } else {
        // Jika null juga, lempar ke catch
        throw new Error("Lokasi tidak ditemukan");
      }

    } catch (error) {
      console.warn("Gagal ambil lokasi asli:", error);
      
      // Tahap C: Fallback Terakhir (Dummy Jakarta)
      alert("⚠️ GPS tidak terdeteksi. Menggunakan lokasi Estimasi (Jakarta).");

      setLocation({
        coords: {
          latitude: -6.2088,
          longitude: 106.8456,
          altitude: 0,
          accuracy: 0,
          altitudeAccuracy: 0,
          heading: 0,
          speed: 0,
        },
        timestamp: Date.now(),
      });
    }
  };

  /**
   * Mengirim data log ke server via API.
   * Menggunakan FormData untuk support upload file.
   */
  const handleSubmit = async () => {
    // Validasi Judul
    if (!title) {
      alert(MESSAGES.validation.title);
      return;
    }

    // Validasi Deskripsi
    if (!description) {
      alert(MESSAGES.validation.description);
      return;
    }

    // Validasi Foto
    if (images.length === 0) {
      alert(MESSAGES.validation.image);
      return;
    }

    // Validasi Lokasi
    if (!location) {
      alert(MESSAGES.validation.location);
      return;
    }

    setLoading(true);

    try {
      // 1. Siapkan data form
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('latitude', location.coords.latitude.toString());
      formData.append('longitude', location.coords.longitude.toString());
      formData.append('visitedAt', new Date().toISOString());
      
      // Kirim file gambar (Multiple)
      images.forEach((uri, index) => {
        // @ts-ignore
        formData.append('photos', {
          uri: uri,
          name: `photo_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      // 2. Kirim ke API
      await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Data berhasil dikirim!");
      
      alert(MESSAGES.system.success);
      router.back(); // Kembali ke home (tutup modal)
      
    } catch (error) {
      console.error(error);
      alert(MESSAGES.system.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Handle bar untuk modal sheet visual cue */}
      <View style={styles.dragHandle} />

      <Text style={styles.title}>Buat Catatan Baru 📝</Text>

      <Text style={styles.label}>Judul Log</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="create-outline" size={20} color={COLORS.textSecondary} style={styles.icon} />
        <TextInput
          style={styles.inputFlex}
          placeholder="Contoh: Perjalanan ke Bandung..."
          placeholderTextColor={COLORS.textSecondary}
          value={title}
          onChangeText={setTitle}
          autoCapitalize="sentences"
          maxLength={50}
          keyboardType="default"
        />
      </View>

      <Text style={styles.label}>Deskripsi</Text>
      <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start', paddingVertical: 12 }]}>
        <Ionicons name="document-text-outline" size={20} color={COLORS.textSecondary} style={styles.icon} />
        <TextInput
          style={[styles.inputFlex, { height: '100%', textAlignVertical: 'top' }]}
          placeholder="Ceritakan pengalamanmu..."
          placeholderTextColor={COLORS.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          autoCapitalize="sentences"
          keyboardType="default"
        />
      </View>

      <TouchableOpacity style={styles.secondaryButton} onPress={getLocation}>
        <Text style={styles.secondaryButtonText}>📍 Ambil Lokasi</Text>
      </TouchableOpacity>
      
      {location && (
        <Text style={styles.locationText}>
          Koordinat: {location.coords.latitude}, {location.coords.longitude}
        </Text>
      )}

      <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
        <Text style={styles.secondaryButtonText}>🖼️ Pilih dari Galeri (Max 100)</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>
            👉 Geser ke samping untuk melihat {images.length} foto
          </Text>
          <ScrollView horizontal style={styles.imageList} showsHorizontalScrollIndicator={true}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.imagePreview} />
          ))}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Simpan Catatan</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    padding: 20,
    // Tambahan padding atas kalau modal
    paddingTop: Platform.OS === 'android' ? 20 : 0, 
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    // marginTop dikurangi karena judul modal biasanya lebih dekat ke atas
    marginTop: 0,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
  inputFlex: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    elevation: 3,
    marginTop: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 10,
    marginTop: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageList: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  imagePreview: {
    borderRadius: 8,
    height: 150,
    width: 150,
    marginRight: 10,
    resizeMode: 'cover',
  },
  locationText: {
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
});
