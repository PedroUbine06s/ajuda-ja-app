import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {createAccount, CreateUserPayload } from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('COMMON');
  const [errors, setErrors] = useState({});

  const router = useRouter();


  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChangeDate = (event, selectedDate) => {
    toggleDatePicker();
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      const formattedDate = currentDate.toISOString().split('T')[0];
      setDateOfBirth(formattedDate);
    }
  };


  const handleCreateAccount = async () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = true;
    if (!email.trim()) newErrors.email = true;
    if (!dateOfBirth.trim()) newErrors.dateOfBirth = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!address.trim()) newErrors.address = true;
    if (!password.trim()) newErrors.password = true;
    if (!confirmPassword.trim()) newErrors.confirmPassword = true;
    if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
      Alert.alert('Erro', 'As senhas não coincidem.');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (!newErrors.confirmPassword || password === confirmPassword) {
         Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      }
      return;
    }

    const formData = {
      name,
      email,
      dateOfBirth,
      phone,
      address,
      password,
      userType,
    };

    if (userType === 'COMMON') {
      try {
          const newUser = await createAccount(formData);
          Alert.alert('Sucesso!', `Conta de prestador para ${newUser.user.name} criada com sucesso!`);
          router.push('/login');
      } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
          Alert.alert('Erro no Cadastro', errorMessage);
      }
    }
    if (userType === 'PROVIDER') {
      router.push({
        pathname: "/service-selection",
        params: formData,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>


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
        onChangeText={setPhone}
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
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirme sua senha"
        secureTextEntry
      />

      <Text style={styles.label}>Qual o tipo de usuário?</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity style={styles.radioButton} onPress={() => setUserType('PROVIDER')}>
          <View style={styles.radio}>
            {userType === 'PROVIDER' && <View style={styles.radioSelected} />}
          </View>
          <Text>Prestador de serviço</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioButton} onPress={() => setUserType('COMMON')}>
          <View style={styles.radio}>
            {userType === 'COMMON' && <View style={styles.radioSelected} />}
          </View>
          <Text>Usuário comum</Text>
        </TouchableOpacity>
      </View>

      <Button title="Continuar" onPress={handleCreateAccount} />
      <View style={styles.buttonSpacer} />
      <Button title="Voltar" onPress={() => router.back()} color="#8a2be2" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    // Add color to make non-editable input text visible
    color: '#000',
  },
  inputError: {
    borderColor: 'red',
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  buttonSpacer: {
    height: 10,
  }
});