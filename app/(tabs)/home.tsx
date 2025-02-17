import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";

export default function HomeScreen() {
    const router = useRouter();
    const user = auth.currentUser; // Obtiene el usuario actual

    const handleLogout = async () => {
        try {
            await auth.signOut(); // Cierra la sesión
            router.replace("/(auth)/login"); // Redirige al login
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error al cerrar sesión:", error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido</Text>
            {user && <Text style={styles.email}>Logueado como: {user.email}</Text>}
            <Button title="Cerrar Sesión" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    email: {
        fontSize: 16,
        marginBottom: 20,
        color: "#666",
    },
});