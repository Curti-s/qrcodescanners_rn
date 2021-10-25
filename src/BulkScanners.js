import React, {
  useState,
  useEffect,
} from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  Button,
  TextInput,
} from 'react-native-paper';

import ScreenWrapper from './components/ScreenWrapper';
import Section from './components/Sections';

export default ({ navigation, route }) => {
  const [barcodeCount, setBarcodeCount] = useState(2);
  const [nativeCameraCodes, setNativeCameraCodes] = useState([]);
  const [nativeCameraStartTime, setNativeCameraStartTime] = useState(0);
  const [nativeCameraEndTime, setNativeCameraEndTime] = useState(0);

  const [scankitBarcodeCount, setScankitBarcodeCount] = useState(2);
  const [scankitCameraCodes, setScankitCameraCodes] = useState([]);
  const [scankitCameraStartTime, setScankitCameraStartTime] = useState(0);
  const [scankitCameraEndTime, setScankitCameraEndTime] = useState(0);

  useEffect(() => {
    if(route?.params?.rnCameraBarcodes) {
      const dataObj = JSON.parse(route.params.rnCameraBarcodes);
      const dataArr = dataObj['barcodeArr'].join(',').split(',');
      setNativeCameraCodes(dataArr);
    }
    if(route?.params?.timeEnd) {
      setNativeCameraEndTime(route.params.timeEnd);
    }
  },[route?.params?.rnCameraBarcodes, route?.params?.timeEnd]);

  useEffect(() => {
    if(route?.params?.scankitBarcodes) {
      const dataObj = JSON.parse(route.params.scankitBarcodes);
      const dataArr = dataObj['scankitBarcodeArr'].join(',').split(',');
      setScankitCameraCodes(dataArr);
    }
    if(route?.params?.scankitTimeEnd) {
      setScankitCameraEndTime(route.params.scankitTimeEnd);
    }
  },[route?.params?.scankitBarcodes, route?.params?.scankitTimeEnd]);

  const renderBarCodes = barcodes => {
    if(barcodes.length) {
      return (
        <View style={{ flex:1, flexDirection:'row', flexWrap:'wrap' }}>
          { barcodes.map(code => <Text key={`${Math.floor(Math.random() * 100)}_${code}`} style={{ fontSize:16, marginHorizontal:4, flexWrap:'wrap' }}>{code}</Text>) }
        </View>
      );
    }
  }

  const renderBarcodeResults = (totalBarcodes, startTime, endTime) => {
    if(!totalBarcodes || !startTime || !endTime) return null;

    return (
      <View style={{ flex:1 }}>
        <Text style={{ fontWeight:'bold' }}>{`Total barcodes scanned: ${totalBarcodes} TimeTaken: ${endTime - startTime}ms`}</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <Section title="RNCamera Bulk Scan">
        <View style={{ flex:1 }}>
          <TextInput 
            label="barcode count"
            mode="outlined"
            placeholder={`Enter barcode count. default is ${barcodeCount}`}
            keyboardType="numeric"
            value={barcodeCount.toString()}
            onChangeText={t => setBarcodeCount(t)}
          />
          {renderBarCodes(nativeCameraCodes)}
          {renderBarcodeResults(nativeCameraCodes.length, nativeCameraStartTime, nativeCameraEndTime) || (
            <Text style={{ fontSize:16 }}>Scanned results will appear here</Text>
          )}
        </View>
        <Button icon="qrcode-scan" mode="contained" onPress={() => {
          setNativeCameraStartTime(Date.now());
          setNativeCameraEndTime(0);
          setNativeCameraCodes([]);
          navigation.setParams({ rnCameraBarcodes:null, timeEnd:null });
          navigation.navigate('rnBulkScanScreen', { barcodeCount });
        }}>
          Start Bulk Scan
        </Button>
      </Section>
      <Section title="Scankit Bulk Scan">
        <View style={{ flex:1 }}>
          <TextInput 
            label="scankit barcode count"
            mode="outlined"
            placeholder={`Enter barcode count. default is ${scankitBarcodeCount}`}
            keyboardType="numeric"
            value={scankitBarcodeCount.toString()}
            onChangeText={t => setScankitBarcodeCount(t)}
          />
          {renderBarCodes(scankitCameraCodes)}
          {renderBarcodeResults(scankitCameraCodes.length, scankitCameraStartTime, scankitCameraEndTime) || (
            <Text style={{ fontSize:16 }}>Scanned results will appear here</Text>
          )}
        </View>
        <Button icon="qrcode-scan" mode="contained" onPress={() => {
          setScankitCameraStartTime(Date.now());
          setScankitCameraEndTime(0);
          setScankitCameraCodes([]);
          navigation.setParams({ scankitBarcodes:null, scankitTimeEnd:null });
          navigation.navigate('scankitBulkScanScreen', { scankitBarcodeCount });
        }}>
          Start Bulk Scan
        </Button>
      </Section>
    </ScreenWrapper>
  );
}
