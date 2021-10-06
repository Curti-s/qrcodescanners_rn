import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class ReactNativeCameraScreen extends React.PureComponent {
  state = {
    flashMode: RNCamera.Constants.FlashMode.off,
  }

  toggleFlashMode = () => this.setState({ flashMode: this.state.flashMode ===  RNCamera.Constants.FlashMode.off ?
      RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off });
  
  render() {
    const { flashMode } = this.state;
    const { navigation } = this.props;

    if(!navigation.isFocused()) return null;

    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
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
        <View style={styles.toggleBtnArea}>
          <Pressable
            style={[styles.btn, { alignSelf: 'flex-end' }]} onPress={this.toggleFlashMode}>
            <Text style={[styles.txt]}>Flash: {this.state.flashMode === 0 ? 'off' : 'on'}</Text>
          </Pressable>
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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  toggleBtnArea: {
    flex:0.1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  btn: {
    flex: 0.3,
    height: 28,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: 'white',
    fontSize: 12,
  },
});
