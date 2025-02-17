import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario logueado:", userCredential.user.uid);
            router.replace("/(tabs)/home"); // Redirige a la pantalla principal
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error:", error);
                Alert.alert("Error", "Correo electrónico o contraseña incorrectos.");
            }
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Iniciar Sesión</Text>
            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: "#ccc" }}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: "#ccc" }}
                secureTextEntry
            />
            <Button title="Iniciar Sesión" onPress={handleLogin} />
            <Text style={{ marginTop: 20, textAlign: "center" }}>
                ¿No tienes una cuenta?{" "}
                <Text
                    style={{ color: "blue", textDecorationLine: "underline" }}
                    onPress={() => router.push("/(auth)/register")}
                >
                    Regístrate
                </Text>
            </Text>
        </View>
    );
};

export default LoginScreen;