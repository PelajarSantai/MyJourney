import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function CreateLogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Catatan Baru 📝</Text>
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
});
