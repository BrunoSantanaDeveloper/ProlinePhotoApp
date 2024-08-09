import { Text, StyleSheet, Pressable } from "react-native";

interface IButton {
  title: string;
  onPress: () => void;
}

export function Button({ title, onPress }: IButton) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({

  buttonText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    height: 50,
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#666CFF",
    alignItems: "center",
    justifyContent: "center",

  }
});
