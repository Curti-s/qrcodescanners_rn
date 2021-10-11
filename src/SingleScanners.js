import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  Button,
} from 'react-native-paper';

import ScreenWrapper from './components/ScreenWrapper';
import Section from  './components/Sections';

export default ({ navigation, route }) => {
  const [nativeCameraCode, setNativeCameraCode] = useState(null);
  const [nativeCameraStartTime, setNativeCameraStartTime] = useState(0);
  const [nativeCameraEndTime, setNativeCameraEndTime] = useState(0);

  const [hmsCode, setHmsCode] = useState(null);
  const [hmsStartTime, setHmsStartTime] = useState(0);
  const [hmsEndTime, setHmsEndTime] = useState(0);
  
  const [visionCameraCode, setVisionCameraCode] = useState(null);
  const [visionCameraStartTime, setVisionCameraStartTime] = useState(0);
  const [visionCameraEndTime, setVisionCameraEndTime] = useState(0);

  const [scanditCode, setScanditCode] = useState(null);
  const [scanditStartTime, setScanditStartTime] = useState(0);
  const [scanditEndTime, setScanditEndTime] = useState(0);

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

  useEffect(() => {
    if(route?.params?.visionCameraBarcode) {
      setVisionCameraCode(route.params.visionCameraBarcode);
    }
    if(route?.params?.visionCameraTimeEnd) {
      setVisionCameraEndTime(route.params.visionCameraTimeEnd);
    }
  },[route?.params?.visionCameraBarcode, route?.params?.visionCameraTimeEnd]);

  useEffect(() => {
    if(route?.params?.scanditBarcode) {
      setScanditCode(route.params.scanditBarcode);
    }
    if(route?.params?.scanditTimeEnd) {
      setScanditEndTime(route.params.scanditTimeEnd);
    }
  },[route?.params?.scanditBarcode, route?.params?.scanditTimeEnd]);

  return (
    <ScreenWrapper>
      <Section title="React native camera">
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:16 }}>{!!nativeCameraCode ? 
            `Barcode ${nativeCameraCode} Time taken:${(!!nativeCameraEndTime && !!nativeCameraStartTime) && nativeCameraEndTime - nativeCameraStartTime} ms` : 
            'Scanned results will appear here'}</Text>
        </View>
        <Button icon="qrcode-scan" mode="contained" onPress={() => {
          setNativeCameraStartTime(Date.now());
          setNativeCameraEndTime(0);
          setNativeCameraCode(null);
          navigation.setParams({ rnCameraBarcode:null, timeEnd:null });
          navigation.navigate('rnCameraScreen');
        }}>
          Start Scan
      </Button>
      </Section>
      <Section title="Scankit">
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:16, }}>{!!hmsCode ?
            `Barcode ${hmsCode} Time taken:${(!!hmsStartTime && !!hmsEndTime) && hmsEndTime - hmsStartTime} ms` :
            'Scanned results will appear here'}</Text>
        </View>
        <Button icon="qrcode-scan" mode="contained" onPress={() => {
          setHmsStartTime(Date.now());
          setHmsEndTime(0);
          setHmsCode(null);
          navigation.setParams({ hmsBarcode:null, hmsTimeEnd:null });
          navigation.navigate('hmsScreen');
        }}>
          Start Scan
        </Button>
      </Section>
      <Section title="Vision Camera">
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:16, }}>{!!visionCameraCode ?
            `Barcode ${visionCameraCode} Time taken:${(!!visionCameraStartTime && !!visionCameraEndTime) && visionCameraEndTime - visionCameraStartTime} ms` :
            'Scanned results will appear here'}</Text>
        </View>
        <Button icon="qrcode-scan" mode="contained" onPress={() => {
          setVisionCameraStartTime(Date.now());
          setVisionCameraEndTime(0);
          setVisionCameraCode(null);
          navigation.setParams({ visionCameraBarcode:null, visionCameraTimeEnd:0 });
          navigation.navigate('visionCameraScreen');
        }}>
          Start Scan
        </Button>
      </Section>
      <Section title="Scandit">
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:16, }}>{!!scanditCode ?
            `Barcode ${scanditCode} Time taken:${(!!scanditStartTime && !!scanditEndTime) && scanditEndTime - scanditStartTime} ms` :
            'Scanned results will appear here'}</Text>
        </View>
        <Button icon="qrcode-scan" mode="contained" onPress={() => {
          setScanditStartTime(Date.now());
          setScanditEndTime(0);
          setScanditCode(null);
          navigation.setParams({ scanditBarcode:null, scanditTimeEnd:0 });
          navigation.navigate('scanditCameraScreen');
        }}>
          Start Scan
        </Button>
      </Section>
    </ScreenWrapper>
  );
}
