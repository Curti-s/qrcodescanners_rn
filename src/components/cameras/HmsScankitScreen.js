import React, {
  useEffect,
  useRef,
} from 'react';
import {
  View,
} from 'react-native';
import ScanPlugin from '@hmscore/react-native-hms-scan';

export default ({ navigation }) => {
  const isMounted = useRef(false);

  useEffect(() => {
    // track mounted state
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    }
  }, []);

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

    return () => {
      if(!isMounted.current) {
        ScanPlugin.CustomizedView.allListenersRemove();
      }
    }
  },[]);

  return (
    <View style={{ flex:1, backgroundColor:'black' }}/>
  );
}
