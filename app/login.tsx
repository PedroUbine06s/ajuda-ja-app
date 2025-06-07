import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { loginIntoAccount } from '../services/api';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleLogin = async () => {
      if (!email || !password) {
          Alert.alert('Erro', 'Por favor, preencha o email e a senha.');
          return;
      }

      loginPayload = {email, password}
      const loginResponse = await loginIntoAccount(loginPayload);
      const isProvider = loginResponse.user.userType === 'PROVIDER'

    if(isProvider){
    router.push({
        pathname: '/provider-home',
        params: {
            user: JSON.stringify(loginResponse.user),
            token: loginResponse.token
        }
    });
}
else {
    router.push({
        pathname: '/user-home',
        params: {
            user: JSON.stringify(loginResponse.user),
            token: loginResponse.token
        }
    });
}


  };

  const handleCreateAccount = () => {
    router.push('/create-account');
  };

  return (
    <View style={styles.container}>
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
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.createAccount} onPress={handleCreateAccount}>
        Criar conta
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  createAccount: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});