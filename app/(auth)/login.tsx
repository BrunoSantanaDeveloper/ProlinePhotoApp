import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter, } from 'expo-router';
import api from '@/services/api';
import { SaveDataToSecureStore } from '@/utils/SecureStore';
import { Feather } from '@expo/vector-icons';

const loginSchema = z.object({
  username: z.string({
    required_error: 'Email obrigatório',
  }).email('Por favor, insira um email válido'),
  password: z.string({
    required_error: 'A senha é obrigatória',
  }).min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    api
      .post("/login", {
        email: data.username,
        password: data.password,
      })
      .then((res) => {
        const { token, user_id } = res.data
        SaveDataToSecureStore('token', token)
        SaveDataToSecureStore('user_id', user_id)
        router.replace("/home")
      })
      .catch((err) => {
        Alert.alert('Email ou senha incorretos, tente novamente.')
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo ao {"\n"}Proline Photo App 👋</Text>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.username && <Text style={styles.error}>{errors.username?.message}</Text>}
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
      <View style={styles.hasAccountContainer}>
        <Text style={styles.label}>Ainda não tem uma conta?</Text>
        <Link href={"/register"} style={styles.link}>Cadastrar-se</Link>
      </View>
      <Button title="Entrar" onPress={handleSubmit(onSubmit)} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3b4056',
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '100%',
  },
  passwordInput: {
    height: 60,
    paddingHorizontal: 1,
    width: '85%',
  },
  error: {
    color: 'red',
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
  },
});