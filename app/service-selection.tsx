import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ApiService,
  createAccount,
  CreateUserPayload,
  getServices,
} from "../services/api";

export default function ServiceSelectionScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<ApiService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setAvailableServices(data);
      } catch (error) {
        Alert.alert(
          "Erro de Rede",
          "Não foi possível carregar a lista de serviços. Tente novamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const toggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const handleContinue = async () => {
    if (selectedServices.length === 0) {
      Alert.alert("Erro", "Selecione pelo menos um serviço.");
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceIds = availableServices
        .filter((service) => selectedServices.includes(service.name))
        .map((service) => service.id);

      const finalPayload: CreateUserPayload = {
        name: params.name as string,
        email: params.email as string,
        dateOfBirth: params.dateOfBirth as string,
        phone: params.phone as string,
        address: params.address as string,
        password: params.password as string,
        userType: "PROVIDER",
        serviceIds: serviceIds,
      };

      const newUser = await createAccount(finalPayload);

      Alert.alert(
        "Sucesso!",
        `Conta de prestador para ${newUser.user.name} criada com sucesso!`
      );
      router.push("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.";
      Alert.alert("Erro no Cadastro", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Serviços</Text>
      <View style={styles.viewContainer}>
        <Text style={styles.label}>
          Quais são os serviços que você presta? Selecione eles abaixo!
        </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#f9b826" />
        ) : (
          <ScrollView
            nestedScrollEnabled={true}
            style={styles.serviceListContainer}
          >
            {availableServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceItem,
                  selectedServices.includes(service.name) &&
                    styles.serviceItemSelected,
                ]}
                onPress={() => toggleService(service.name)}
              >
                <Text
                  style={[
                    styles.serviceItemText,
                    selectedServices.includes(service.name) &&
                      styles.serviceItemTextSelected,
                  ]}
                >
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.label}>Serviços Selecionados:</Text>
        <View style={styles.tagsContainer}>
          {selectedServices.length > 0 ? (
            selectedServices.map((service, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{service}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>
              Nenhum serviço selecionado
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isSubmitting || isLoading ? styles.buttonDisabled : null,
          ]}
          onPress={handleContinue}
          disabled={isSubmitting || isLoading}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Finalizando cadastro..." : "Finalizar Cadastro"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  viewContainer: {
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#f9b826",
    backgroundColor: "#ffffff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#f9b826",
    backgroundColor: "#ffffff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    minHeight: 30,
  },
  tag: {
    backgroundColor: "#f9b826",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    margin: 5,
  },
  tagText: {
    color: "white",
  },
  placeholderText: {
    color: "gray",
    fontStyle: "italic",
    marginLeft: 5,
  },
  serviceListContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    maxHeight: 250,
  },
  serviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  serviceItemSelected: {
    backgroundColor: "#fff9e6",
  },
  serviceItemText: {
    fontSize: 16,
  },
  serviceItemTextSelected: {
    fontWeight: "bold",
    color: "#c79a00",
  },
  button: {
    backgroundColor: "#f9b826",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  backButton: {
    backgroundColor: "#8a8a8a",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: "#e9e9e9",
  },
});
