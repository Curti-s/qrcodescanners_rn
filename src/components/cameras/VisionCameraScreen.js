import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  AppState,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import  {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  Button,
} from 'react-native-paper';
import {
  scanQRCodes,
} from 'vision-camera-qrcode-scanner';

export default ({ navigation }) => {
  const isMounted = useRef(false);
  const [cameraPermission, setCameraPermission] = useState('not-determined');
  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState('off');

  useEffect(() => {
    // track mounted state
    isMounted.current = true;
    setIsActive(true);

    return () => {
      isMounted.current = false;
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if(isMounted.current) {
        try {
          const isCameraPermitted = await Camera.getCameraPermissionStatus();

          if(isCameraPermitted !== 'authorized') {
            try {
              const permissionRequest = await Camera.requestCameraPermission();
              setCameraPermission(permissionRequest);
            } catch(err) {
              console.error(`request camera permission failed: ${JSON.stringify(err)}`);
            }
          }
        } catch(err) {
          console.error(`get camera permission failed: ${JSON.stringify(err)}`);
        }
      }
    })();
  },[cameraPermission]);

  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if(nextAppState.match(/inactive|background/)) {
        if(flash === 'on') setFlash('off')
      }
    }

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if(appStateSubscription) {
        appStateSubscription.remove();
      }
    }
  },[])

  const devices = useCameraDevices();
  const device = devices.back;

  const frameProcessor = useFrameProcessor(frame => {
    if(frame) {
      'worklet';
      try {
        // const qrCodes = scanQRCodes(frame);
        console.log(`logging frameProcessor ${JSON.stringify({})}`);
      } catch(err) {
        console.error(`frameprocessor failed: ${JSON.stringify(err)}`);
      }
    }
  }, []);

  const toggleFlash = useCallback(() => setFlash(f => (f === 'off' ? 'on' : 'off')));
  const onError = useCallback(err => console.error(err));

  if(device == null || !navigation.isFocused()) return <ActivityIndicator />;
-

  return (
    <View style={styles.container}>
      {device != null && (
        <Camera style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        torch={flash}
        onError={onError}
        frameProcessor={frameProcessor}
      />
      <View style={{ backgroundColor:'transparent', alignItems:'flex-end' }}>
        <Button icon="flash" color="white" mode="text" onPress={toggleFlash}>Flash</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'black',
  }
});
