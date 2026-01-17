import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';

export default function CreateLogScreen() {
  const [title, setTitle] = useState('');
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
  },
});
