import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MyComponent = () => {
  const [latLongData, setLatLongData] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    fetchData();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        console.log('Permissão de localização negada');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/PedroEspiindola/json/main/dadosrecife.json');
      const data = await response.json();

      const coordinates = data.records.map((record) => ({
        latitude: parseFloat(record[9]),
        longitude: parseFloat(record[10]),
        nome_estabelecimento: record[1],
        tipo_estabelecimento: record[2],
      }));

      setLatLongData(coordinates);
      setFilteredMarkers(coordinates);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleTypeSelection = (type) => {
    const filtered = latLongData.filter((marker) => marker.tipo_estabelecimento === type);
    setFilteredMarkers(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation ? userLocation.latitude : -8.0476,
            longitude: userLocation ? userLocation.longitude : -34.8770,
            latitudeDelta: 0.0822,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          {filteredMarkers.map((coordinate, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: coordinate.latitude, longitude: coordinate.longitude }}
              title={coordinate.nome_estabelecimento}
            />
          ))}
          {userLocation && (
            <Marker
              coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
              title="Sua Localização"
              pinColor="aquamarine"
            />
          )}
        </MapView>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonColumn}>
          {['Bares e Restaurantes', 'Hotéis e Pousadas'].map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, styles.card]}
              onPress={() => handleTypeSelection(type)}
            >
              <Text style={styles.buttonText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonColumn}>
          {['Outras Atividades Comerciais', 'Saúde e Beleza'].map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, styles.card]}
              onPress={() => handleTypeSelection(type)}
            >
              <Text style={styles.buttonText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonColumn}>
          {['Entretenimento', 'Outros Serviços'].map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, styles.card]}
              onPress={() => handleTypeSelection(type)}
            >
              <Text style={styles.buttonText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonColumn}>
          {['Educação', 'Lojas'].map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, styles.card]}
              onPress={() => handleTypeSelection(type)}
            >
              <Text style={styles.buttonText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  mapContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    overflow: 'hidden',
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 2 - 20,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  buttonColumn: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#DDDDDD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
  },
});

export default MyComponent;
