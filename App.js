// app.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './Home';
import LocaisScreen from './Locais';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'RECIFE DESCONTOS' }}
        />
        <Stack.Screen
          name="Locais"
          component={LocaisScreen}
          options={{ title: 'Locais com Descontos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
