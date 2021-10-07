import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  View,
} from 'react-native';
import ScanPlugin from '@hmscore/react-native-hms-scan';

export default ({ navigation }) => {
  const isMounted = useRef(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // track mounted state
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    // call requestCameraAndStoragePermission API
    if(isMounted.current) {
      ScanPlugin.Permission.hasCameraAndStoragePermission()
        .then(res => setHasPermission(res))
        .catch(err => console.error(`has camera & storage permission failed: ${JSON.stringify(err, null, 1)}`));

      if(!hasPermission) {
        ScanPlugin.Permission.requestCameraAndStoragePermission()
          .then(res => setHasPermission(res))
          .catch(err => console.error(`request camera & storage permission failed: ${JSON.stringify(err)}`));
      }
    }
  }, [hasPermission]);

  const customizedViewRequest = {
    scanType: 0, // ScanPlugin.ScanType.All
    additionalScanTypes: [],
    rectHeight: 200,
    rectWidth: 200,
    continuouslyScan: false,
    isFlashAvailable: true,
    flashOnLightChange: false,
    isGalleryAvailable: false,
  }

  useEffect(() => {
    if(isMounted.current) {
      ScanPlugin.CustomizedView.startCustomizedView(customizedViewRequest)
        .then(res => {
          const { originalValue:hmsBarcode } = res;
          navigation.navigate({
            name:'singleScanScreen',
            params: { hmsBarcode, hmsTimeEnd:Date.now() },
            merge: true,
          });
        })
        .catch(err => console.error(`scanner failed to start: ${JSON.stringify(err)}`));

      ScanPlugin.CustomizedView.onStopListenerAdd(() => navigation.pop());
    }

    return () => ScanPlugin.CustomizedView.allListenersRemove();
  },[]);

  return (
    <View style={{ flex:1, backgroundColor:'black' }}/>
  );
}
