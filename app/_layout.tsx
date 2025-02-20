import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/home"); // Usuario logueado, redirige a Home
      } else {
        router.replace("/(auth)/login"); // Usuario no logueado, redirige a Login
      }
    });

    return unsubscribe; // Limpia el listener al desmontar
  }, []);

  return <Slot />;
}