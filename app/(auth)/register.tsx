import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [credentialsError, setCredentialsError] = useState("");
    const router = useRouter();

    const validateFields = () => {
        let valid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setEmailError("El correo electrónico es obligatorio.");
            valid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError("El formato del correo electrónico no es válido.");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("La contraseña es obligatoria.");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Las contraseñas no coinciden.");
            valid = false;
        } else {
            setConfirmPasswordError("");
        }

        return valid;
    };

    const handleRegister = async () => {
        if (!validateFields()) return;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Usuario registrado:", userCredential.user.uid);
            router.replace("/(tabs)/home"); // Redirige a Home después del registro
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error:", error.message);
                if (error.code === "auth/invalid-email") {
                    setEmailError("El correo electrónico no es válido.");
                } else if (error.code === "auth/email-already-in-use") {
                    setEmailError("El correo electrónico ya está en uso.");
                } else {
                    setCredentialsError("Error al registrar el usuario.");
                }
            }
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Registrarse</Text>
            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={{
                    marginBottom: 10,
                    padding: 10,
                    borderWidth: emailError ? 3 : 1,
                    borderColor: emailError ? "red" : "#ccc",
                    borderRadius: 5
                }}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {emailError && <Text style={{ color: "red", marginBottom: 10 }}>{emailError}</Text>}
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                style={{
                    marginBottom: 10,
                    padding: 10,
                    borderWidth: passwordError ? 3 : 1,
                    borderColor: passwordError ? "red" : "#ccc",
                    borderRadius: 5
                }}
                secureTextEntry
            />
            {passwordError && <Text style={{ color: "red", marginBottom: 10 }}>{passwordError}</Text>}
            <TextInput
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={{
                    marginBottom: 10,
                    padding: 10,
                    borderWidth: confirmPasswordError ? 3 : 1,
                    borderColor: confirmPasswordError ? "red" : "#ccc",
                    borderRadius: 5
                }}
                secureTextEntry
            />
            {confirmPasswordError && <Text style={{ color: "red", marginBottom: 10 }}>{confirmPasswordError}</Text>}
            {credentialsError && <Text style={{ color: "red", marginBottom: 10 }}>{credentialsError}</Text>}
            <Button title="Registrarse" onPress={handleRegister} />
            <Text style={{ marginTop: 20, textAlign: "center" }}>
                ¿Ya tienes una cuenta?{" "}
                <Text
                    style={{ color: "blue", textDecorationLine: "underline" }}
                    onPress={() => router.push("/login")}
                >
                    Inicia sesión
                </Text>
            </Text>
        </View>
    );
};

export default RegisterScreen;