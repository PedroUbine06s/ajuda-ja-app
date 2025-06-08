import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function UserHomeScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  let displayData: any = {};

  console.log("UserHomeScreen - Raw params from useLocalSearchParams:", params);

  try {
    if (params.user && typeof params.user === 'string') {
      displayData.user = JSON.parse(params.user);
    } else {
      displayData.user = params.user;
    }

    if (params.token) {
      displayData.token = params.token;
    } else {
      displayData.token = null;
    }

  } catch (e: any) {
    console.error("Failed to parse 'user' parameter in UserHomeScreen:", e);
    displayData = { ...params, parsingError: e.message };
  }

  const dumpedParams = JSON.stringify(displayData, null, 2);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>

        <View style={styles.logoView}>
          <Image
            source={require('../assets/images/app-icon.png')}
            style={styles.logo}
          />
          <Image
            source={require('../assets/images/default-icon.jpg')}
            style={styles.fotoPerfil}
          />
        </View>
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.welcomeText}>Seja bem-vindo</Text>
        <Text style={styles.welcomeText}>Nome!</Text>
        <View style={{marginTop: 20}}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('')}>
            <Text style={styles.cardText}>Solicitar Serviço</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('')}>
            <Text style={styles.cardText}>Meus Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.editCard]} onPress={() => router.push('')}>
            <Text style={[styles.cardText, {color: 'black'}]}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.logoutCard]} onPress={() => router.push('/login')}>
            <Text style={styles.cardText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9b826',
  },
  header: {
    alignItems: 'center',
  },
  logoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
    borderColor: 'black',
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    
    borderRadius: 20,
    backgroundColor: 'white',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    flex: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  card: {
    backgroundColor: '#f9b826',
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: 'center',
  },
  logoutCard: {
    marginTop: 100,
    backgroundColor: '#8a8a8a',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  editCard: {
    backgroundColor: 'white',
    color: 'black',
    borderWidth: 2,
    borderColor: '#f9b826',
  },
});