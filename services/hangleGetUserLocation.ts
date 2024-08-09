import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import * as Location from 'expo-location';

export async function handleGetUserLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Você deve aceitar a permissão de localização para usar o app')
    return
  }
  return await Location.getCurrentPositionAsync({});
}