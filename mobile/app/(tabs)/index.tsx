import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* bagian header */}
      <View>
        <Text>MyJourney ✈️</Text>
        <Text>Rekam jejak petualanganmu</Text>
      </View>

      {/* area konten */}
      <View style={styles.content}>
        <Text>List akan muncul disini</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});