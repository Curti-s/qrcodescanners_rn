import React from 'react';
import {
  View,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {
  Button,
} from 'react-native-paper';
import {
  RNCamera,
} from 'react-native-camera';

export default class RNCameraBulkScanScreen extends React.PureComponent {
  state = {
    barcodeArr:[],
    counter:0,
  };

  render() {
    const { navigation } =  this.props;
    const { barcodeCount } = this.props?.route?.params;
    const { barcodeArr, counter } = this.state;

    return (
      <View style={styles.container}>
        <RNCamera 
          style={StyleSheet.absoluteFill}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            let newState = barcodeArr.slice();

            if(barcodes.length) {
                const { data:barcode } = barcodes[0];
              
                if(!newState.includes(barcode)) {
                  newState.splice(newState.length,0,barcode);
                  this.setState({ barcodeArr:newState, counter:counter + 1 });
                } else {
                  ToastAndroid.show(`${barcode} already scanned`, ToastAndroid.SHORT);
                }

              if(counter == barcodeCount) {
                navigation.navigate({
                  name:'bulkScanScreen',
                  params: { rnCameraBarcodes:JSON.stringify({ barcodeArr }), timeEnd:Date.now() },
                  merge:true,
                });
              }
            }
          }}
          googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL}
          googleVisionBarcodeMode={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.ALTERNATE}
          captureAudio={false}
        />
        <View style={{ backgroundColor:'transparent', alignItems:'flex-end' }}>
          <Button icon="flash" color="white" mode="text" >Flash</Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex:1, }
});

