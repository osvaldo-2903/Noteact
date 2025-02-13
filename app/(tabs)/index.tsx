import { Text, View, StyleSheet } from "react-native";
import ImageViewer from "../components/ImageViewer";

const 

export default function Index() {
    return (
        <View style={styles.imageContainer}>
            <Image source={Image} style={styles.image} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: "#fff"
    },
    button: {
        fontSize: 20,
        textDecorationLine: "underline",
        color: "#fff"
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    }
});