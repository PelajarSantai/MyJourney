import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    StatusBar,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import axios from "axios";

export default function DetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parsing params safely
    const { id, title, description, visitedAt, latitude, longitude, imageUrl } = params;

    const [deleting, setDeleting] = useState(false);

    const API_URL = "http://10.0.2.2:3000/api/logs";

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
                            // Call API Delete
                            // await axios.delete(`${API_URL}/${id}`);

                            // For now, since we might be using dummy data or local state is not synced globally yet,
                            // just simulate success and go back.
                            // In real app using the API:
                            await axios.delete(`${API_URL}/${id}`);

                            Alert.alert("Berhasil", "Catatan berhasil dihapus", [
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

    const savedLat = parseFloat(latitude as string) || 0;
    const savedLong = parseFloat(longitude as string) || 0;
    const hasLocation = savedLat !== 0 && savedLong !== 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Full Image */}
                {imageUrl ? (
                    <Image source={{ uri: imageUrl as string }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={50} color="#ccc" />
                        <Text style={{ color: "#aaa", marginTop: 8 }}>Tidak ada foto</Text>
                    </View>
                )}

                {/* Content */}
                <View style={styles.contentContainer}>
                    <Text style={styles.date}>
                        {new Date(visitedAt as string).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </Text>

                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.description}>
                        {description ? description : "Tidak ada deskripsi"}
                    </Text>

                    {/* Map Section */}
                    {hasLocation && (
                        <View style={styles.mapContainer}>
                            <Text style={styles.sectionTitle}>Lokasi 📍</Text>
                            <View style={styles.mapWrapper}>
                                <MapView
                                    provider={PROVIDER_DEFAULT}
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: savedLat,
                                        longitude: savedLong,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                    scrollEnabled={false} // Disable scroll for simple view
                                    zoomEnabled={false}
                                >
                                    <Marker
                                        coordinate={{ latitude: savedLat, longitude: savedLong }}
                                        title={title as string}
                                    />
                                </MapView>
                            </View>
                        </View>
                    )}

                    {/* Delete Button */}
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
        backgroundColor: "#fff",
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
        flex: 1,
        textAlign: "center",
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
