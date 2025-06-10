import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function MapaScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [filter, setFilter] = useState('');
    const [selectedMarker, setSelectedMarker] = useState(null);

    let displayData: any = {};

    const markers = [
        {
            id: 1,
            name: 'Maria Oliveira',
            service: 'Eletricista',
            top: 120,
            left: 100,
        },
        {
            id: 2,
            name: 'Carlos Silva',
            service: 'Encanador',
            top: 410,
            left: 300,
        },
        {
            id: 3,
            name: 'Ana Souza',
            service: 'Carpinteira',
            top: 90,
            left: 310,
        },
    ];

    const filteredMarkers = markers.filter((marker) =>
        marker.service.toLowerCase().includes(filter.toLowerCase())
    );

    const dumpedParams = JSON.stringify(displayData, null, 2);
    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <Image
                    source={require('../assets/images/mapa.png')}
                    style={styles.map}
                />

                {filteredMarkers.map((marker) => (
                    <TouchableOpacity
                        key={marker.id}
                        style={[styles.marker, { top: marker.top, left: marker.left }]}
                        onPress={() => setSelectedMarker(marker)}
                    >
                        <View style={styles.dot} />
                        <View style={styles.square} />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.filterContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Filtrar por serviço"
                    value={filter}
                    onChangeText={setFilter}
                />
            </View>

            <Modal
                visible={!!selectedMarker}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedMarker(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedMarker?.name}</Text>
                        <Text style={styles.modalService}>{selectedMarker?.service}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setSelectedMarker(null);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Solicitar Serviço</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedMarker(null)}>
                            <Text style={styles.modalClose}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    mapContainer: {
        position: 'relative',
        flex: 1,
        backgroundColor: 'black',
    },
    map: {
        width: '100%',
        height: '100%'
    },
    marker: {
        position: 'absolute',
        alignItems: 'center',
    },
    dot: {
        width: 25,
        height: 25,
        backgroundColor: '#f9b826',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#000',
    },
    square: {
        width: 15,
        height: 15,
        backgroundColor: '#f9b826',
        transform: [{rotate: '45deg'}],
        marginTop: -13.48,
        borderBottomWidth: 2,
        borderRightWidth: 2,
    },
    filterContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalService: {
        fontSize: 14,
        color: '#666',
        marginVertical: 10,
    },
    modalButton: {
        backgroundColor: '#f9b826',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        fontWeight: 'bold',
        color: '#000',
    },
    modalClose: {
        color: '#666',
        marginTop: 10,
    },
});
