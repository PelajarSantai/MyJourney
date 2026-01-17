import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function CreateLogScreen() {
  // Tipe data custom
  type LocationState = Location.LocationObject | null;
  type ImageState = string | null;

  // State untuk menyimpan input form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // State untuk data multimedia (foto & lokasi)
  const [image, setImage] = useState<ImageState>(null);
  const [location, setLocation] = useState<LocationState>(null);
  
  // State UI
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // IP Emulator Android (Ganti kalau pakai HP fisik)
  const API_URL = "http://10.0.2.2:3000/api/logs";

  /**
   * Membuka kamera menggunakan Expo ImagePicker.
   * User perlu memberikan izin akses kamera.
   */
  const pickImage = async () => {
    // 1. Minta Izin Kamera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Maaf, kami butuh izin akses kamera untuk fitur ini!');
      return;
    }

    console.log("Izin kamera diberikan, siap meluncur!");

    // 2. Buka Kamera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  /**
   * Mengambil koordinat GPS saat ini menggunakan Expo Location.
   * Membutuhkan izin foreground location.
   */
  const getLocation = async () => {
    // 1. Minta Izin Lokasi
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Izin lokasi ditolak! Tidak bisa mengambil koordinat.');
      return;
    }

    console.log("Izin lokasi aman!");

    // 2. Ambil Koordinat
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log(location);
  };

  /**
   * Mengirim data log ke server via API.
   * Menggunakan FormData untuk support upload file.
   */
  const handleSubmit = async () => {
    // Validasi Judul
    if (!title) {
      alert("Mohon isi judul catatanmu dulu ya! 📝");
      return;
    }

    // Validasi Deskripsi
    if (!description) {
      alert("Ceritain sedikit dong tentang perjalananmu! ✍️");
      return;
    }

    // Validasi Foto
    if (!image) {
      alert("Wajib upload foto kenangan ya! 📸");
      return;
    }

    // Validasi Lokasi
    if (!location) {
      alert("Jangan lupa ambil lokasi ya, biar tau ini dimana! 📍");
      return;
    }

    setLoading(true);

    try {
      // 1. Siapkan data form
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('visitedAt', new Date().toISOString());
      
      // Kirim file gambar
      // @ts-ignore
      formData.append('image', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      // 2. Kirim ke API
      await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Data berhasil dikirim!");
      
      alert("Catatan berhasil disimpan! 🎉");
      router.back(); // Kembali ke home
      
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Catatan Baru 📝</Text>

      <Text style={styles.label}>Judul Log</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Perjalanan ke Bandung..."
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ceritakan pengalamanmu..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.secondaryButton} onPress={getLocation}>
        <Text style={styles.secondaryButtonText}>📍 Ambil Lokasi</Text>
      </TouchableOpacity>
      
      {location && (
        <Text style={styles.locationText}>
          Koordinat: {location.coords.latitude}, {location.coords.longitude}
        </Text>
      )}

      <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
        <Text style={styles.secondaryButtonText}>📸 Ambil Foto</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

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
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    // Shadow (Bayangan)
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#e1f0ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  locationText: {
    marginBottom: 10,
    color: '#666',
    textAlign: 'center',
  },
});
