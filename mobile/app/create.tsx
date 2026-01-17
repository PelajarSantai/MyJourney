import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function CreateLogScreen() {
  return (
    <View style={styles.container}>
      <Text>Halaman Tambah Catatan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
