import { useEffect, useState } from "react";
import { Alert, ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/(app)");
    }
  }, [router, user]);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Datos incompletos", "Ingresa correo y contraseña numérica");
      return;
    }

    try {
      await login(email, password);
    } catch {
      // El error ya se muestra en el contexto
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GestorPinto</Text>
      <Text style={styles.subtitle}>Inicia sesión para acceder a tus recursos</Text>
      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#6B7280"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña numérica"
        placeholderTextColor="#6B7280"
        secureTextEntry
        keyboardType="numeric"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 24,
    justifyContent: "center"
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8
  },
  subtitle: {
    color: "#475569",
    marginBottom: 24,
    fontSize: 16
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: "#0F172A"
  },
  button: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  }
});
