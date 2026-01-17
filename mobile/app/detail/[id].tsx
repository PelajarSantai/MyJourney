import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

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
    const [deleting, setDeleting] = useState(false); // State untuk loading hapus
    const [data, setData] = useState<TravelLog | null>(null);

    // Gunakan IP yang sama dengan Home
    const API_URL = `http://10.0.2.2:3000/api/logs`;

    useEffect(() => {
        if (!id) return;
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            setData(response.data);
        } catch (error) {
            console.error("Gagal ambil detail:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = () => {
        Alert.alert(
            "Hapus Catatan",
            "Yakin ingin menghapus kenangan ini? 🥺",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setDeleting(true);
                            await axios.delete(`${API_URL}/${id}`);

                            Alert.alert("Berhasil", "Catatan terhapus!", [
                                { text: "OK", onPress: () => router.back() }
                            ]);
                        } catch (error) {
                            console.error("Gagal hapus:", error);
                            Alert.alert("Error", "Gagal menghapus data");
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

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

    const imageUrl = data.photos && data.photos.length > 0
        ? `http://10.0.2.2:3000${data.photos[0].url}`
        : null;

    const hasLocation = data.latitude !== 0 && data.longitude !== 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>Detail Perjalanan</Text>

                {/* Tombol Edit (Bonus) */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push({
                        pathname: "/edit/[id]",
                        params: {
                            id: data.id,
                            title: data.title,
                            description: data.description || ""
                        }
                    })}
                >
                    <Ionicons name="create-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
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

                    {/* Maps Section */}
                    {hasLocation && (
                        <View style={styles.mapContainer}>
                            <Text style={styles.sectionTitle}>Lokasi 📍</Text>
                            <View style={styles.mapWrapper}>
                                <MapView
                                    provider={PROVIDER_DEFAULT}
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: data.latitude,
                                        longitude: data.longitude,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                    scrollEnabled={false}
                                    zoomEnabled={false}
                                >
                                    <Marker
                                        coordinate={{ latitude: data.latitude, longitude: data.longitude }}
                                        title={data.title}
                                    />
                                </MapView>
                            </View>
                        </View>
                    )}

                    {/* Tombol Hapus */}
                    <TouchableOpacity
                        style={[styles.deleteButton, deleting && styles.disabledButton]}
                        onPress={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <Text style={styles.deleteText}>Menghapus...</Text>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.deleteText}>Hapus Catatan</Text>
                            </View>
                        )}
                    </TouchableOpacity>
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
        flex: 1, // Agar title di tengah jika space cukup
        marginLeft: 10,
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
    mapContainer: {
        marginTop: 10,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#333",
    },
    mapWrapper: {
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#eee",
    },
    map: {
        width: "100%",
        height: 200,
    },
    deleteButton: {
        backgroundColor: "#FF3B30",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.7,
    },
    deleteText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
