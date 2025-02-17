import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function RootLayout() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace("/(tabs)/home");
            } else {
                router.replace("/(auth)/login");
            }
        });

        return unsubscribe;
    }, []);

    return <Slot />;
}