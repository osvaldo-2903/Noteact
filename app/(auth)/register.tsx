import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { auth, db } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Usuario registrado:", user.uid);

            // Guardar el usuario en Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: email,
            });

            router.replace("/(tabs)/home"); // Redirige a Home después del registro
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error:", error.message);
                Alert.alert("Error", "No se pudo registrar el usuario.");
            }
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Registrarse</Text>
            <TextInput
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: "#ccc" }}
            />
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
            <Button title="Registrarse" onPress={handleRegister} />
            <Text style={{ marginTop: 20, textAlign: "center" }}>
                ¿Ya tienes una cuenta?{" "}
                <Text
                    style={{ color: "blue", textDecorationLine: "underline" }}
                    onPress={() => router.push("/(auth)/login")}
                >
                    Inicia sesión
                </Text>
            </Text>
        </View>
    );
};

export default RegisterScreen;