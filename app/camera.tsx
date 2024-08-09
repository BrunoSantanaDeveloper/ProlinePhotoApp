import api from '@/services/api';
import { handleGetUserLocation } from '@/services/hangleGetUserLocation';
import { GetDataFromSecureStore } from '@/utils/SecureStore';
import { Feather } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Para usar o app, você precisa liberar as permissões de câmera e localização.</Text>
        <Button onPress={requestPermission} title="Conceder permissões" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const location = await handleGetUserLocation();
      const photo = await cameraRef.current.takePictureAsync();
      const userId = await GetDataFromSecureStore('user_id')
      const token = await GetDataFromSecureStore('token')

      api.post('photos', {
        "photo_path": photo?.uri,
        "latitude": location?.coords?.latitude,
        "longitude": location?.coords?.longitude,
        "user_id": userId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(() => {
        Alert.alert('Foto salva com sucesso!')
        router.back()
      }).catch((err) => {
        Alert.alert('Não foi possível salvar a foto, tente novamente mais tarde.')
      })
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera}
        facing={facing}
        ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'white',
            }}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Trocar de Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Feather name="camera" size={24} color="black" />
            <Text style={styles.text} >Tirar Foto</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    marginHorizontal: 20,
    paddingBottom: 10,
    fontSize: 18,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

});