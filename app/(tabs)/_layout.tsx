// app/_layout.tsx
import { Slot } from 'expo-router';
import DrawerLayout from '../components/DrawerLayout';
import { auth } from '@/firebaseConfig';

export default function RootLayout() {
    const user = auth.currentUser;

    // Si el usuario está logueado, muestra el menú lateral
    if (user) {
        return (
            <DrawerLayout>
                <Slot />
            </DrawerLayout>
        );
    }

    // Si no está logueado, muestra las rutas sin el menú lateral
    return <Slot />;
}