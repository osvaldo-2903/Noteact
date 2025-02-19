import * as React from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function HomeScreen() {
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

interface CustomDrawerContentProps {
    navigation: any;
}

function CustomDrawerContent(props: CustomDrawerContentProps) {
    const user = auth.currentUser;
    const router = useRouter(); // Usa useRouter de expo-router

    const handleLogout = async () => {
        try {
            await auth.signOut(); // Cierra la sesión
            router.replace("/(auth)/login"); // Redirige al login usando router
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error al cerrar sesión:", error.message);
            }
        }
    };

    return (
        <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
                {user && <Text style={styles.drawerEmail}>Logueado como: {user.email}</Text>}
            </View>
            <Button
                title="Cerrar Sesión"
                onPress={() => {
                    props.navigation.closeDrawer(); // Cierra el menú lateral
                    handleLogout(); // Llama a la función de cierre de sesión
                }}
            />
        </View>
    );
}

export default function App() {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={HomeScreen} />
        </Drawer.Navigator>
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
    drawerContent: {
        flex: 1,
        paddingTop: 20,
    },
    drawerHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    drawerEmail: {
        fontSize: 16,
        color: "#666",
    },
});