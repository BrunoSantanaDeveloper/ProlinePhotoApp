import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Text, View, StyleSheet, } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo ao Proline Photo App</Text>
      <Text style={styles.subtitle}>
        Para usar o app, você precisa liberar as permissões de câmera, galeria e
        localização.
      </Text>
      <Button title="📷 Tirar nova foto" onPress={() => router.push('/camera')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#56d156",
    alignItems: "center",
    justifyContent: "center",

  }
});
