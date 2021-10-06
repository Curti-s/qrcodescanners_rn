import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';

import ScreenWrapper from './components/ScreenWrapper';
import Section from  './components/Sections';

export default ({ navigation, route }) => {
  const [nativeCameraCode, setNativeCameraCode] = useState(null);
  const [nativeCameraStartTime, setNativeCameraStartTime] = useState(0);
  const [nativeCameraEndTime, setNativeCameraEndTime] = useState(0);

  useEffect(() => {
    if(route?.params?.rnCameraBarcode) {
      setNativeCameraCode(route.params.rnCameraBarcode);
    }
    if(route?.params?.timeEnd) {
      setNativeCameraEndTime(route.params.timeEnd);
    }
  },[route?.params?.rnCameraBarcode, route?.params?.timeEnd]);

  return (
    <ScreenWrapper>
      <Section title="React native camera">
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:16 }}>{!!nativeCameraCode ? 
            `Barcode ${nativeCameraCode} Time taken:${(!!nativeCameraEndTime && !!nativeCameraStartTime) && nativeCameraEndTime - nativeCameraStartTime} ms` : 
            'Scanned results will appear here'}</Text>
        </View>
        <Button title="start scan" onPress={() => {
          setNativeCameraStartTime(Date.now());
          navigation.navigate('rnCameraScreen');
        }} />
      </Section>
    </ScreenWrapper>
  );
}
