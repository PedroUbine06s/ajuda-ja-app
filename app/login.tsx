import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginIntoAccount } from "../services/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha o email e a senha.");
      return;
    }

    const loginPayload = { email, password };
    const loginResponse = await loginIntoAccount(loginPayload);
    const isProvider = loginResponse.user.userType === "PROVIDER";

    if (isProvider) {
      router.push({
        pathname: "/provider-home",
        params: {
          user: JSON.stringify(loginResponse.user),
          token: loginResponse.token,
        },
      });
    } else {
      router.push({
        pathname: "/user-home",
        params: {
          user: JSON.stringify(loginResponse.user),
          token: loginResponse.token,
        },
      });
    }
  };

  const handleCreateAccount = () => {
    router.push("/create-account");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/app-icon.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Bem vindo ao Ajuda Já!</Text>
        <Text style={styles.subHeaderText}>Faça seu login!</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.textNoLogin}>Não possui um login?</Text>
        <Text style={styles.createAccount} onPress={handleCreateAccount}>
          Clique aqui para criar uma conta!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 18,
    color: "#8a8a8a",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    borderColor: "#f9b826",
    borderWidth: 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#8a8a8a",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#f9b826",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  textNoLogin: {
    marginTop: 20,
    textAlign: "center",
    color: "#8a8a8a",
  },
  createAccount: {
    color: "blue",
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 6,
  },
});
