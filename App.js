/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-reanimated';
import React, {
  useState,
  useEffect,
} from 'react';
import type { Node } from 'react';
import {
  Button,
  PermissionsAndroid,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import Section from './src/components/Sections';
import ScreenWrapper from './src/components/ScreenWrapper';
import SingleScanScreen from './src/SingleScanners';
import BulkScanScreen from './src/BulkScanners';
import ReactNativeCameraScreen from './src/components/cameras/ReactNativeCameraScreen';
import HmsScankitScreen from './src/components/cameras/HmsScankitScreen';
import VisionCameraScreen from './src/components/cameras/VisionCameraScreen';
import ScanditCameraScreen from './src/components/cameras/ScanditCameraScreen';

const Stack = createNativeStackNavigator();

const HomeScreen: () => Node = ({ navigation }) => {
  const [hasCameraPermission, setCameraPermission] = useState(false);

  useEffect(() => {
    const checkForPermission  = async () => {
      const cameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if(!cameraPermission) {
        await requestCameraPermission(cameraPermission);
      } else {
        setCameraPermission(true);
      }
    };

    const requestCameraPermission = async cameraPermission => {
      if(!cameraPermission) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

        if(granted === PermissionsAndroid.RESULTS.GRANTED) {
          setCameraPermission(true);
        } else {
          console.error(`camera permission denied`);
          setCameraPermission(false);
        }
      }
    };
    checkForPermission();
  },[hasCameraPermission]);

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
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="home">
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="singleScanScreen" component={SingleScanScreen} />
          <Stack.Screen name="bulkScanScreen" component={BulkScanScreen} />
          <Stack.Screen name="rnCameraScreen" component={ReactNativeCameraScreen} />
          <Stack.Screen name="hmsScreen" component={HmsScankitScreen} />
          <Stack.Screen name="visionCameraScreen" component={VisionCameraScreen} />
          <Stack.Screen name="scanditCameraScreen" component={ScanditCameraScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
