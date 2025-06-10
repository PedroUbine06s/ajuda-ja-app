import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createAccount } from "../services/api";

export default function CreateAccountScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("COMMON");
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChangeDate = (event: any, selectedDate: any) => {
    toggleDatePicker();
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      const formattedDate = currentDate.toISOString().split("T")[0];
      setDateOfBirth(formattedDate);
    }
  };

  const handleCreateAccount = async () => {
    const newErrors: any = {};

    if (!name.trim()) newErrors.name = true;
    if (!email.trim()) newErrors.email = true;
    if (!dateOfBirth.trim()) newErrors.dateOfBirth = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!address.trim()) newErrors.address = true;
    if (!password.trim()) newErrors.password = true;
    if (!confirmPassword.trim()) newErrors.confirmPassword = true;
    if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
      Alert.alert("Erro", "As senhas não coincidem.");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (!newErrors.confirmPassword || password === confirmPassword) {
        Alert.alert(
          "Erro",
          "Por favor, preencha todos os campos corretamente."
        );
      }
      return;
    }

    const formData: any = {
      name,
      email,
      dateOfBirth,
      phone,
      address,
      password,
      userType,
    };

    if (userType === "COMMON") {
      try {
        const newUser = await createAccount(formData);
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
      }
    }
    if (userType === "PROVIDER") {
      router.push({
        pathname: "/service-selection",
        params: formData,
      });
    }
  };

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 11);

    if (cleaned.length === 0) return "";

    if (cleaned.length < 3) {
      return `(${cleaned}`;
    }

    const ddd = cleaned.slice(0, 2);
    const number = cleaned.slice(2);

    let formatted = `(${ddd}) `;

    if (number.length <= 8) {
      formatted += number.slice(0, 4);
      if (number.length > 4) {
        formatted += `-${number.slice(4)}`;
      }
    } else {
      formatted += number.slice(0, 5);
      if (number.length > 5) {
        formatted += `-${number.slice(5)}`;
      }
    }

    return formatted;
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
        >
          <Text style={styles.title}>Criar conta</Text>
          <View style={styles.overlay} pointerEvents="none" />
          <View style={styles.formContainer}>
            {showPicker && (
              <DateTimePicker
                mode="date"
                display="default"
                value={date}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome completo"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Data de Nascimento</Text>
            <TouchableOpacity onPress={toggleDatePicker}>
              <TextInput
                style={[styles.input, errors.dateOfBirth && styles.inputError]}
                value={dateOfBirth}
                placeholder="AAAA-MM-DD"
                editable={false}
              />
            </TouchableOpacity>

            <Text style={styles.label}>Número de celular</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={phone}
              onChangeText={(text) => setPhone(formatPhoneNumber(text))}
              placeholder="(XX) XXXXX-XXXX"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={address}
              onChangeText={setAddress}
              placeholder="Seu endereço completo"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={password}
              onChangeText={setPassword}
              placeholder="Crie uma senha"
              secureTextEntry
            />

            <Text style={styles.label}>Digite a senha novamente</Text>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirme sua senha"
              secureTextEntry
            />

            <Text style={styles.label}>Qual o tipo de usuário?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setUserType("PROVIDER")}
              >
                <View style={styles.radio}>
                  {userType === "PROVIDER" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text>Prestador de serviço</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setUserType("COMMON")}
              >
                <View style={styles.radio}>
                  {userType === "COMMON" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text>Usuário comum</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateAccount}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "#f9b826",
    padding: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 0,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    borderColor: "#f9b826",
    borderWidth: 2,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    borderColor: "#f9b826",
    borderWidth: 2,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#8a8a8a",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    // Add color to make non-editable input text visible
    color: "#000",
    backgroundColor: "#f5f5f5",
  },
  inputError: {
    borderColor: "red",
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#000",
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
});
