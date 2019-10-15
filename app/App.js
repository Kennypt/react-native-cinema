import React from 'react';
import { View, StatusBar } from 'react-native';
import Screen from './Screen';

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={false} />
        <Screen />
      </View>
    );
  }
}
