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
  const [hmsCode, setHmsCode] = useState(null);
  const [hmsStartTime, setHmsStartTime] = useState(0);
  const [hmsEndTime, setHmsEndTime] = useState(0);

  useEffect(() => {
    if(route?.params?.rnCameraBarcode) {
      setNativeCameraCode(route.params.rnCameraBarcode);
    }
    if(route?.params?.timeEnd) {
      setNativeCameraEndTime(route.params.timeEnd);
    }
  },[route?.params?.rnCameraBarcode, route?.params?.timeEnd]);

  useEffect(() => {
    if(route?.params?.hmsBarcode) {
      setHmsCode(route.params.hmsBarcode);
    }
    if(route?.params?.hmsTimeEnd) {
      setHmsEndTime(route.params.hmsTimeEnd);
    }
  },[route?.params?.hmsBarcode, route?.params?.hmsTimeEnd]);

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
          setNativeCameraEndTime(0);
          setNativeCameraCode(null);
          navigation.setParams({ rnCameraBarcode:null, timeEnd:null });
          navigation.navigate('rnCameraScreen');
        }} />
      </Section>
      <Section title="Scankit">
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:16, }}>{!!hmsCode ?
            `Barcode ${hmsCode} Time taken:${(!!hmsStartTime && !!hmsEndTime) && hmsEndTime - hmsStartTime} ms` :
            'Scanned results will appear here'}</Text>
        </View>
        <Button title="start scan" onPress={() => {
          setHmsStartTime(Date.now());
          setHmsEndTime(0);
          setHmsCode(null);
          navigation.navigate('hmsScreen');
          }} />
      </Section>
      <Section title="Vision Camera">
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:16, }}>Scanned results will appear here</Text>
        </View>
        <Button title="start scan" onPress={() => navigation.navigate('visionCameraScreen') }/>
      </Section>
    </ScreenWrapper>
  );
}
