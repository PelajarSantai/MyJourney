import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

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
    const router = useRouter();
    const { id } = params;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<TravelLog | null>(null);
    const API_URL = `http://10.0.2.2:3000/api/logs/${id}`;

    useEffect(() => {
        if (!id) return;
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
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
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.center}>
                <Text>Data tidak ditemukan :(</Text>
            </View>
        );
    }

    // Ambil foto pertama jika ada
    const imageUrl = data.photos && data.photos.length > 0
        ? `http://10.0.2.2:3000${data.photos[0].url}`
        : null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>Detail Perjalanan</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Foto Utama */}
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={50} color="#ccc" />
                        <Text style={{ color: "#aaa", marginTop: 8 }}>Tidak ada foto</Text>
                    </View>
                )}

                {/* Konten Text */}
                <View style={styles.contentContainer}>
                    <Text style={styles.date}>
                        {new Date(data.visitedAt).toLocaleDateString("id-ID", {
                            weekday: "long", day: "numeric", month: "long", year: "numeric",
                        })}
                    </Text>

                    <Text style={styles.title}>{data.title}</Text>

                    <Text style={styles.description}>
                        {data.description ? data.description : "Tidak ada deskripsi"}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    scrollContent: {
        paddingBottom: 40,
    },
    image: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
    },
    placeholderImage: {
        width: "100%",
        height: 250,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
    },
    contentContainer: {
        padding: 20,
    },
    date: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: "#444",
        lineHeight: 24,
        marginBottom: 24,
    },
});
