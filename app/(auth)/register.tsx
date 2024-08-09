import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "expo-router";
import api from "@/services/api";
import Feather from '@expo/vector-icons/Feather';
const registerSchema = z
  .object({
    name: z
      .string({
        required_error: "O nome é obrigatório",
      })
      .min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z
      .string({
        required_error: "Email é obrigatório",
      })
      .email("Por favor, insira um email válido"),
    password: z
      .string({
        required_error: "Senha é obrigatório",
      })
      .min(8, "A senha deve ter pelo menos 8 caracteres"),
    password_confirmation: z
      .string({
        required_error: "Confirmação de senha é obrigatório",
      })
      .min(8, "A senha deve ter pelo menos 8 caracteres"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    api
      .post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation
      },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
      .then(() => router.replace("/login"))
      .catch((err) => {
        Alert.alert('Não foi possível registrar, tente novamente mais tarde.')
      })
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta 🚀</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.name && (
              <Text style={styles.error}>{errors.name?.message}</Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email?.message}</Text>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Senha"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPassword}
              />
              <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="black" onPress={() => setShowPassword((prev) => !prev)} />
            </View>
            {errors.password && (
              <Text style={styles.error}>{errors.password?.message}</Text>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="password_confirmation"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirmação de Senha"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPasswordConfirmation}
              />
              <Feather name={showPasswordConfirmation ? "eye" : "eye-off"} size={24} color="black" onPress={() => setShowPasswordConfirmation((prev) => !prev)} />
            </View>
            {errors.password_confirmation && (
              <Text style={styles.error}>{errors.password_confirmation?.message}</Text>
            )}
          </>
        )}
      />

      <View style={styles.hasAccountContainer}>
        <Text style={styles.label}>Já tem uma conta?</Text>
        <Link href={"/login"} style={styles.link}>
          Entrar
        </Link>
      </View>

      <Button title="Registrar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#3b4056',
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  passwordInput: {
    height: 60,
    paddingHorizontal: 1,
    width: '85%',
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  hasAccountContainer: {
    marginTop: 20,
    display: "flex",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  link: {
    color: "#666CFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  passwordContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
});
