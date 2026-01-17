import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Warna Tema (Konsisten dengan modal.tsx)
const COLORS = {
    primary: '#007AFF',
    secondary: '#e1f0ff',
    background: '#fff',
    text: '#333',
    textSecondary: '#666',
    border: '#ddd',
    inputBg: '#f9f9f9',
    white: '#fff',
};

export default function EditScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, title: initialTitle, description: initialDesc } = params;

    const [title, setTitle] = useState(initialTitle as string || '');
    const [description, setDescription] = useState(initialDesc as string || '');
    const [loading, setLoading] = useState(false);

    const API_URL = "http://10.0.2.2:3000/api/logs";

    const handleSave = async () => {
        if (!title) {
            Alert.alert("Validasi", "Judul tidak boleh kosong");
            return;
        }

        setLoading(true);
        try {
            await axios.put(`${API_URL}/${id}`, {
                title,
                description
            });

            Alert.alert("Berhasil", "Catatan berhasil diperbarui!", [
                { text: "OK", onPress: () => router.dismissTo("/") } // Kembali ke Home agar refresh
            ]);
        } catch (error) {
            console.error("Gagal update:", error);
            Alert.alert("Error", "Gagal menyimpan perubahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>Batal</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Catatan ✏️</Text>
                <View style={{ width: 40 }} />
            </View>

            <Text style={styles.label}>Judul Log</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="create-outline" size={20} color={COLORS.textSecondary} style={styles.icon} />
                <TextInput
                    style={styles.inputFlex}
                    placeholder="Judul Catatan"
                    placeholderTextColor={COLORS.textSecondary}
                    value={title}
                    onChangeText={setTitle}
                    autoCapitalize="sentences"
                />
            </View>

            <Text style={styles.label}>Deskripsi</Text>
            <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start', paddingVertical: 12 }]}>
                <Ionicons name="document-text-outline" size={20} color={COLORS.textSecondary} style={styles.icon} />
                <TextInput
                    style={[styles.inputFlex, { height: '100%', textAlignVertical: 'top' }]}
                    placeholder="Ceritakan pengalamanmu..."
                    placeholderTextColor={COLORS.textSecondary}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Simpan Perubahan</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        flex: 1,
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: 16,
        marginBottom: 8,
    },
    inputContainer: {
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderColor: COLORS.border,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    inputFlex: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
    },
    button: {
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        marginTop: 20,
        padding: 15,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
