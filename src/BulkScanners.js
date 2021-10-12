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


  const renderRNCameraBarcodes = () => {
    if(nativeCameraCodes.length) {
      return (
        <View style={{ flex:1, flexDirection:'row' }}>
          { nativeCameraCodes.map(code => <Text style={{ fontSize:16, marginHorizontal:4, flexWrap:'wrap' }}>{code}</Text>) }
        </View>
      );
    }
  }

  const renderBarcodeResults = (totalBarcodes, startTime, endTime) => {
    if(!totalBarcodes || !startTime || !endTime) return null;

    return (
      <View style={{ flex:1 }}>
        <Text style={{ fontWeight:'bold',  }}>{`Total barcodes scanned: ${totalBarcodes} TimeTaken: ${endTime - startTime}ms`}</Text>
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
          {renderRNCameraBarcodes()}
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
    </ScreenWrapper>
  );
}
