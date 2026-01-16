import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tulis Cerita Perjalanan</Text>

      {/* Input Judul */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Judul</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Contoh: Pantai Kuta Bali" 
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Input Deskripsi */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ceritakan pengalamanmu</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Hari ini sangat menyenangkan..." 
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Tombol Simpan Dummy */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Simpan Catatan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});