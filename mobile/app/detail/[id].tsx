import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

// Definisikan tipe data sesuai dengan yang dari API
interface TravelLog {
    id: number;
    title: string;
    description: string | null;
    visitedAt: string;
    latitude: number;
    longitude: number;
    photos: { url: string }[];
}

export default function DetailScreen() {
    const params = useLocalSearchParams();
    const { id } = params;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<TravelLog | null>(null);

    // Endpoint API
    const API_URL = `http://10.0.2.2:3000/api/logs/${id}`;

    useEffect(() => {
        if (!id) return;
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            console.log(`Fetching detail for ID: ${id}...`);
            const response = await axios.get(API_URL);
            setData(response.data);
        } catch (error) {
            console.error("Gagal ambil detail:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 10 }}>Memuat data...</Text>
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.container}>
                <Text>Data tidak ditemukan :(</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Tampilkan JSON dulu untuk memastikan data masuk */}
            <Text style={styles.title}>{data.title}</Text>
            <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
