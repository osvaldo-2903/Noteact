import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { auth, db } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function AboutScreen() {
    const [name, setName] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUserName = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setName(docSnap.data().name);
                }
            }
        };

        fetchUserName();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)/login"); // Redirige a la pantalla de login después de cerrar sesión
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Bienvenido, {name}</Text>
            <Button title="Cerrar sesión" onPress={handleSignOut} />
        </View>
    );
}