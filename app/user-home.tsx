import {
  createServiceRequest,
  getNearbyProviders,
  patchLoggedUserLocation,
} from "@/services/api";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function UserHomeScreen() {
  const params = useLocalSearchParams();
  const userToken = params.token as string;

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(
          "Permissão de localização negada. Por favor, ative-a nas configurações do dispositivo."
        );
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        if (!userToken) {
          console.warn(
            "Token de usuário não fornecido. Interrompendo chamadas à API."
          );
          return;
        }

        await patchLoggedUserLocation(
          userToken,
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );

        const nearbyProviders = await getNearbyProviders(
          userToken,
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        setProviders(nearbyProviders);
      } catch (error: any) {
        setErrorMsg(
          error.message || "Ocorreu um erro ao obter dados. Tente novamente."
        );
        console.error("Error during location/provider fetching:", error);
      }
    })();
  }, []);

  const handleProviderPress = async (provider: any) => {
    setSelectedProvider(provider);
    setModalVisible(true);
  };

  const handleHirePress = (phoneNumber: string) => {
    if (!phoneNumber) {
      Alert.alert("Erro", "Número de telefone não disponível.");
      return;
    }

    try {
      const hireProviderResponse = createServiceRequest(
        userToken,
        selectedProvider.id
      );

      if (!hireProviderResponse) {
        Alert.alert("Erro", "Não foi possível contratar o prestador.");
        return;
      }
    } catch (error) {
      console.error("Erro ao contratar prestador:", error);
      Alert.alert("Erro", "Ocorreu um erro ao contratar o prestador.");
      return;
    }

    const formattedPhoneNumber = phoneNumber.replace(/\D/g, "");
    const whatsappUrl = `whatsapp://send?phone=${formattedPhoneNumber}`;
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(whatsappUrl);
        } else {
          Alert.alert(
            "Erro",
            "O WhatsApp não está instalado no seu dispositivo."
          );
        }
      })
      .catch((err) => console.error("Erro ao abrir WhatsApp:", err));
  };

  const renderContent = () => {
    if (errorMsg) {
      return <Text style={styles.infoText}>{errorMsg}</Text>;
    }

    if (!location) {
      return (
        <View style={styles.infoContainer}>
          <ActivityIndicator size="large" color="#f9b826" />
          <Text style={styles.infoText}>Obtendo sua localização...</Text>
        </View>
      );
    }

    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title={"Você está aqui"}
          pinColor={"#f9b826"}
        />

        {providers.map((provider) => (
          <Marker
            key={provider.id}
            coordinate={{
              latitude: provider.location.coordinates[1],
              longitude: provider.location.coordinates[0],
            }}
            title={provider.name}
            description={"Clique para ver detalhes"}
            pinColor={"#2a6f97"}
            onPress={() => handleProviderPress(provider)}
          />
        ))}
      </MapView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoView}>
          <Image
            source={require("../assets/images/app-icon.png")}
            style={styles.logo}
          />
          <Image
            source={require("../assets/images/default-icon.jpg")}
            style={styles.fotoPerfil}
          />
        </View>
      </View>
      <View style={styles.mapContainer}>{renderContent()}</View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>Detalhes do Prestador</Text>
            {selectedProvider && (
              <>
                <Text style={modalStyles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Nome:</Text>{" "}
                  {selectedProvider.name}
                </Text>
                <Text style={modalStyles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Serviços:</Text>{" "}
                  {selectedProvider.providerProfile.services
                    .map((service: any) => service.name)
                    .join(", ")}
                </Text>
                <Text style={modalStyles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Telefone:</Text>{" "}
                  {selectedProvider.phone}
                </Text>
                <Pressable
                  style={[modalStyles.button, modalStyles.buttonHire]}
                  onPress={() => handleHirePress(selectedProvider.phone)}
                >
                  <Text style={modalStyles.textStyle}>
                    Contratar via WhatsApp
                  </Text>
                </Pressable>
              </>
            )}
            <Pressable
              style={[modalStyles.button, modalStyles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={modalStyles.textStyle}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#f9b826",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  logoView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  fotoPerfil: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "white",
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    paddingHorizontal: 20,
    textAlign: "center",
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%", // Adjust width as needed
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#2a6f97",
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24, // Improve readability
  },
  button: {
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    marginTop: 15,
    width: "70%",
  },
  buttonHire: {
    backgroundColor: "#25D366", // WhatsApp green
  },
  buttonClose: {
    backgroundColor: "#f9b826",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
