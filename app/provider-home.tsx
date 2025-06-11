import { getMyServicesRequests, patchLoggedUserLocation } from "@/services/api";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WhatsAppIcon = () => (
  <Image
    source={require("../assets/images/zap.png")}
    style={{ width: 40, height: 40 }}
  />
);

export default function ProviderHomeScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const userToken = params.token as string;

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [myServicesRequests, setMyServicesRequests] = useState<any[] | null>(
    null
  );

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

        if (userToken) {
          await patchLoggedUserLocation(
            userToken,
            currentLocation.coords.latitude,
            currentLocation.coords.longitude
          );
        } else {
          console.warn("Token de usuário não fornecido.");
        }
      } catch (error) {
        setErrorMsg("Não foi possível obter a localização atual.");
        console.error(error);
      }

      try {
        const myServicesRequestsResponse = await getMyServicesRequests(
          userToken
        );
        setMyServicesRequests(myServicesRequestsResponse);
      } catch (error) {
        console.error("Erro ao obter solicitações de serviços:", error);
        Alert.alert(
          "Erro",
          "Não foi possível carregar as solicitações de serviços. Tente novamente."
        );
      }
    })();
  }, []);

  const openWhatsApp = (phoneNumber: string) => {
    let formattedNumber = phoneNumber.replace(/\D/g, "");
    if (!formattedNumber.startsWith("55")) {
      formattedNumber = `55${formattedNumber}`;
    }

    const whatsappUrl = `https://wa.me/${formattedNumber}`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert(
            "Erro",
            "O WhatsApp não está instalado neste dispositivo."
          );
        }
      })
      .catch((err) =>
        console.error("Ocorreu um erro ao tentar abrir o WhatsApp:", err)
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
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {myServicesRequests && myServicesRequests.length > 0 ? (
          myServicesRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <Text style={styles.requesterName}>
                  {request.commonUser.name}
                </Text>
                <Text style={styles.requesterPhone}>
                  {request.commonUser.phone}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => openWhatsApp(request.commonUser.phone)}
                style={styles.whatsappButton}
              >
                <WhatsAppIcon />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noRequestsText}>
            Nenhuma solicitação encontrada.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9b826",
  },
  header: {
    alignItems: "center",
  },
  logoView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "white",
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    flexGrow: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  requestInfo: {
    flex: 1,
  },
  requesterName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  requesterPhone: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  whatsappButton: {
    padding: 10,
  },
  noRequestsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
