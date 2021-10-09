import * as React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Button,
} from 'react-native-paper';
import { RNCamera } from 'react-native-camera';

export default class ReactNativeCameraScreen extends React.PureComponent {
  state = {
    flashMode: RNCamera.Constants.FlashMode.off,
  }

  toggleFlash = () => this.setState({ flashMode: this.state.flashMode ===  RNCamera.Constants.FlashMode.off ?
      RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off });
  
  render() {
    const { flashMode } = this.state;
    const { navigation } = this.props;

    if(!navigation.isFocused()) return null;

    return (
      <View style={styles.container}>
        <RNCamera
          style={StyleSheet.absoluteFill}
          type={RNCamera.Constants.Type.back}
          flashMode={flashMode}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            if(barcodes.length) {
              const { data:barcode } = barcodes[0];
              navigation.navigate({
                name:'singleScanScreen',
                params: { rnCameraBarcode:barcode, timeEnd:Date.now() },
                merge:true,
              });
            }
          }}
          googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL}
          googleVisionBarcodeMode={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.ALTERNATE}
          captureAudio={false}
        />
        <View style={{ backgroundColor:'transparent', alignItems:'flex-end' }}>
          <Button icon="flash" color="white" mode="text" onPress={this.toggleFlash}>Flash</Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
});
