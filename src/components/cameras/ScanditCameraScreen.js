import React, {
  useEffect,
  useRef,
} from 'react';
import {
  AppState,
} from 'react-native';
import {
  ActivityIndicator,
} from 'react-native-paper';
import {
  BarcodeCapture,
  BarcodeCaptureSettings,
  BarcodeCaptureOverlay,
  Symbology,
} from 'scandit-react-native-datacapture-barcode';
import {
  Brush,
  Camera,
  Color,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  RectangularViewfinder,
  RectangularViewfinderStyle,
  RectangularViewfinderLineStyle,
  VideoResolution,
} from 'scandit-react-native-datacapture-core';

export default () => {
  // barcode capture settings
  const settings = new BarcodeCaptureSettings();
  settings.enableSymbologies([
    Symbology.QR,
  ]);
  const cameraContext = DataCaptureContext
        .forLicenseKey("AQSQtiTbBLZtCK1RGzN5SW8Wrwi9AW2SAGw//VtfjUVSbBAz/UEFOKotrjY6LB9Yr27oz2VZSR+XTldSzXh8tpBNb+jwJtdYnxEyK6Jh1SD3e7UrSnYWrnJhA7POPN5MairK4xwVPYDjbCf4eWJ5pIYAKzyDLSNOSl4Z5UhBtuUzc07AMRf4I88fJjw4bHb8p1r2ftxvQA40cg3gwkp9ioVmyuRaTFAB+HAibRdWKXB8U9+22W/OVE5w5ilFRO5R2Ww+M4le0CaycRnSgyi+QAJUJ9k0e/W27WW9ETFWY6YpVqivyRYiKVpe3QQDQhCqJF1xECsHa1snboh6s2kWij1FltcfdiVdKRh6foNOt+u0RkekiEKkdJcGPxIIQFFVPVAf5RlBmCEwdHTYtibnDa9KjEqHVUqIN2juuf5eT3YdUMv9w3EH4iB13WPRTrfRP2/2CXAOq9Hab/pcvUBqGews44rBRHDtjQC+HfRNbh8VbsmICUR4TYNePqhaO732hntYKfth8k2Ydesn+m/xJURvzZyrUeQ8FEjDJLAZ0MpJEJ2VFUHhaijDNlhSRoU1qiWKl1TduN5z4AAvgBng7UKqJsKummCN1P2iHssCzRLrbTWx8/yXTRvr5Ixq6u52XRtbDbyI0lIcoa4K1Bb6seP+WgV1xd8RERouCMdDPiNbUkxIFH1DdMCxTkdrX04LAYsJAhuwUkdWfqPVXzqTxlDuOJ73pVDH5P2NT4aJIjenSgSX1XWH2Q8z6DPV6cgs4BnnG0RqvIA1RvxXkO2b4ufuhYL0eo7x2LeXC4fFSohFR8KLv+Og27TLYivK99iyEey2/CaXxJbM7W/z1cAf2eQ0C4fEXOF5OIuU6Lc9Z4OCk7DeTl33+TDygL8xE8eHsuHjP58qMFKjUE6d+9MNwTkvg2J+FT2xNTwXeKJPhUiwUYLx9BjR3TNAaoMUUOP7ANNMf3FnRvZHFTjxzppy6+Y7oBvMD1XSae0CQDZt2YXUNITAI6lyNoJxZCHhHhxTMzHa4nLDhOAeeMBHqU1ubK1wPHjIz9td+wtRXQ5QcnepSnMVNVwDDi7IdbndNn89W9OxSfMCwHwNSeCpU+ggIj3sP1Amuzegs9+2w1EzklrWchTr+irjBijy6CpaNnPfZSoi9BiCjvAdbC0lpw3frFj8eqJy+JcoYV7jV8+zLoa8indMdNkC705KIpP0Ecs61Ca4e2B27GxUPJHNNHIh1A==");
  const barcodeCapture = useRef(BarcodeCapture.forContext(cameraContext, settings));
  const camera = useRef(Camera.default);

  const isMounted = useRef();
  const viewRef = useRef();

  useEffect(() => {
    // track mounted state
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    }
  }, []);

  // barcode capture listener
  const barcodeCaptureListener = {
    didScan: (barcodeCapture, session) => {
      const recognizedBarcodes = session.newlyRecognizedBarcodes;
      console.log(`recognizedBarcodes: ${JSON.stringify(recognizedBarcodes)}`);
      console.log(`setupScanning: didScan: ${JSON.stringify(barcodeCapture)}`)
    }
  };

  const setupScanning = () => {
    try {
      if(!barcodeCapture.current) {
        barcodeCapture.current = BarcodeCapture.forContext(cameraContext, settings);
      }

      barcodeCapture.current.addListener(barcodeCaptureListener);

      // Add a barcode capture overlay to the data capture view to render the location of captured barcodes on top of
      // the video preview. This is optional, but recommended for better visual feedback.
      try {
        if(barcodeCapture.current) {
          const overlay = BarcodeCaptureOverlay.withBarcodeCaptureForView(barcodeCapture.current, viewRef.current);
          overlay.viewfinder = new RectangularViewfinder(
            RectangularViewfinderStyle.Square,
            RectangularViewfinderLineStyle.Light,
          );

          // Adjust the overlay's barcode highlighting to match the new viewfinder styles and improve the visibility of
          // feedback. With 6.10 we will introduce this visual treatment as a new style for the overlay.
          overlay.brush = new Brush(Color.fromRGBA(0, 0, 0, 0), Color.fromHex('FFFF'), 3);
        }
      } catch(er) {
        console.error(`failed to create overlays: ${typeof er === 'object' ? JSON.stringify(er) : er}`);
      }
    } catch(err) {
      console.error(`failed to set up camera: ${typeof err === 'object' ? JSON.stringify(err) : err}`);
    }
  };

  const startCamera = () => {
    try {
      if(isMounted.current) {
        if(!camera.current) {
          camera.current = Camera.default;
        }
        const cameraSettings = BarcodeCapture.recommendedCameraSettings;
        camera.current.applySettings(cameraSettings);
        cameraSettings.preferredResolution = VideoResolution.FullHD;
        cameraContext.setFrameSource(camera.current);

        camera.current.switchToDesiredState(FrameSourceState.On);
        barcodeCapture.current.isEnabled = true;
      }
    } catch(err) { 
      console.error(`failed to start camera: ${typeof err === 'object' ? JSON.stringify(err) : err}`);
    }
  };

  useEffect(() => {
    if(isMounted.current) {
      setupScanning();
      startCamera();
    }
  },[camera]);

  const stopCamera = () => {
    if(camera) {
      camera.current.switchToDesiredState(FrameSourceState.Off);
      barcodeCapture.current.isEnabled = false;
    }
  };

  const handleAppStateChange = async nextAppState => {
    if (nextAppState.match(/inactive|background/)) {
      stopCamera();
      cameraContext.dispose();
    } else {
      setupScanning();
      startCamera();
    }
  };

  useEffect(() => {
    let appStateSubscription = null;
    if(isMounted.current) {
      appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    }
    return () => {
      if(!isMounted.current) {
        if(appStateSubscription) {
          appStateSubscription.remove();
        }

        if(barcodeCapture.current) {
          barcodeCapture.current.removeListener(barcodeCaptureListener);
        }
      }
    }
  },[]);

  const { desiredState } = camera;
  
  if(desiredState === 'off') {
    return <ActivityIndicator animating />
  }

  return <DataCaptureView style={{ flex:1 }} context={cameraContext} ref={viewRef} />;
}
