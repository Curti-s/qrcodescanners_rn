import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class RNativeContinuousBarcodeScanner extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize:16 }}>RNativeContinuousBarcodeScanner</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex:1, }
})

