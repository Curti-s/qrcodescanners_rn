/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import {
  Button,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Section from './src/components/Sections';
import ScreenWrapper from './src/components/ScreenWrapper';
import SingleScanScreen from './src/SingleScanners';
import BulkScanScreen from './src/BulkScanners';

const Stack = createNativeStackNavigator();

const HomeScreen: () => Node = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <Section title="Single Scan">
        <Button title="Go to Single scan implementations" onPress={() => navigation.navigate('singleScanScreen') } />
      </Section>
      <Section title="Bulk Scan">
        <Button title="Go to Bulk scan implementations" onPress={() => navigation.navigate('bulkScanScreen') } />
      </Section>
    </ScreenWrapper>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="singleScanScreen" component={SingleScanScreen} />
        <Stack.Screen name="bulkScanScreen" component={BulkScanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
