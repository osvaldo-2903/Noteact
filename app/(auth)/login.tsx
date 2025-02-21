import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [credentialsError, setCredentialsError] = useState(false);
    const router = useRouter();

    const validateFields = () => {
        let valid = true;
        if (!email) {
            setError("El correo electrónico es obligatorio.");
            setEmailError(true);
            valid = false;
        } else {
            setEmailError(false);
        }
        if (!password) {
            setError("La contraseña es obligatoria.");
            setPasswordError(true);
            valid = false;
        } else {
            setPasswordError(false);
        }
        return valid;
    };

    const handleLogin = async () => {
        if (!validateFields()) return;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario logueado:", userCredential.user.uid);
            router.replace("/(tabs)/home"); // Redirige a Home después del login
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error:", error.message);
                setError("Correo electrónico o contraseña incorrectos.");
                setCredentialsError(true);
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
                style={{
                    marginBottom: 10,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: emailError ? "red" : "#ccc"
                }}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {emailError && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                style={{
                    marginBottom: 10,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: passwordError ? "red" : "#ccc"
                }}
                secureTextEntry
            />
            {passwordError && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}
            {credentialsError && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}
            <Button title="Iniciar Sesión" onPress={handleLogin} />
            <Text style={{ marginTop: 20, textAlign: "center" }}>
                ¿No tienes una cuenta?{" "}
                <Text
                    style={{ color: "blue", textDecorationLine: "underline" }}
                    onPress={() => router.push("/register")}
                >
                    Regístrate
                </Text>
            </Text>
        </View>
    );
};

export default LoginScreen;