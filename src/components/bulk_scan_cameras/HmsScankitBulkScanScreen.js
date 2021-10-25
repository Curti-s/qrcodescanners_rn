import React, {
  useEffect,
  useRef,
} from 'react';
import {
  View,
  ToastAndroid,
} from 'react-native';
import ScanPlugin from '@hmscore/react-native-hms-scan';

export default ({ navigation, route }) => {
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
    continuouslyScan: true,
    isFlashAvailable: true,
    flashOnLightChange: false,
    isGalleryAvailable: false,
  };

  useEffect(() => {
    if(isMounted.current) {
      ScanPlugin.CustomizedView.startCustomizedView(customizedViewRequest)
    }

    return () => {
      if(!isMounted.current) {
        ScanPlugin.CustomizedView.allListenersRemove();
      } 
    }
  },[]);

  useEffect(() => {
    if(isMounted.current) {
      const { scankitBarcodeCount } = route?.params;
      const scankitBarcodeArr = [];
      let counter = 0;

      ScanPlugin.CustomizedView.onResponseListenerAdd(res => {
        if(scankitBarcodeCount > 1) {
          const { originalValue:scankitBarcode } = res;

          if(!scankitBarcodeArr.includes(scankitBarcode)) {
            scankitBarcodeArr.splice(scankitBarcodeArr.length,0,scankitBarcode);
            counter++;
          } else {
            ToastAndroid.show(`${scankitBarcode} already scanned`, ToastAndroid.SHORT);
          }
          console.log(`scankitBarcodeArr: ${JSON.stringify(scankitBarcodeArr)}`)

          if(counter == scankitBarcodeCount) {
            ScanPlugin.CustomizedView.pauseContinuouslyScan()
              .then(res => {
                console.log(`pauseContinuouslyScan: ${JSON.stringify(res)}`)
                navigation.navigate({
                  name:'bulkScanScreen',
                  params: { scankitBarcodes:JSON.stringify({ scankitBarcodeArr }), scankitTimeEnd:Date.now() },
                  merge:true,
                });
              })
              .catch(err => console.error(`Continuous scan failed: ${err}`))
          }
        }
      });
    }
    ScanPlugin.CustomizedView.onOriginalScanLoadListenerAdd((res) => console.log(`onOriginalScanLoadListenerAdd: ${JSON.stringify(res)}`))
  },[]);

  return (
    <View style={{ flex:1, backgroundColor:'black' }}/>
  );
}
