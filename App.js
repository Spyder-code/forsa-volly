import React, { Component } from 'react'
import { View,Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import User from './component/User';
import Home from './component/Home';
import Nilai from './component/Nilai';
import Pertandingan from './component/Pertandingan';


function HomeScreen() {
  return (
    <Home/>
  );
}

function NilaiScreen() {
  return (
    <Nilai/>
  );
}
function PemainScreen() {
  return (
    <User/>
  );
}
function PertandinganScreen() {
  return (
    <Pertandingan/>
  );
}

const Tab = createBottomTabNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'Nilai') {
                iconName = focused ? 'pen' : 'pen';
              } else if (route.name === 'Pertandingan') {
                iconName = focused ? 'volleyball-ball' : 'volleyball-ball';
              }else if (route.name === 'Pemain') {
                iconName = focused ? 'user' : 'user';
              }

              // You can return any component that you like here!
              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Nilai" component={NilaiScreen} />
          <Tab.Screen name="Pemain" component={PemainScreen} />
          <Tab.Screen name="Pertandingan" component={PertandinganScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}