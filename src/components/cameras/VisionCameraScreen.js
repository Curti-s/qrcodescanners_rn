import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import  {
  Camera,
  useCameraDevices,
} from 'react-native-vision-camera';
import {
  Button,
} from 'react-native-paper';

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

  const devices = useCameraDevices();
  const device = devices.back;

  const toggleFlash = useCallback(() => setFlash(f => (f === 'off' ? 'on' : 'off')));

  if(device == null) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <Camera style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        torch={flash}
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
