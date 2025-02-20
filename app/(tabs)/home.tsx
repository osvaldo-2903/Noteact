import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from "react-native";

export default function HomeScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [tasks, setTasks] = useState<{ title: string; description: string; dueDate: string }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const addTask = () => {
        if (title && description && dueDate) {
            const newTask = { title, description, dueDate };
            setTasks([...tasks, newTask]);
            setTitle("");
            setDescription("");
            setDueDate("");
            setModalVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Agregar Tarea" onPress={() => setModalVisible(true)} />
            <FlatList
                data={tasks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.task}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <Text>{item.description}</Text>
                        <Text>{item.dueDate}</Text>
                    </View>
                )}
                style={styles.taskList}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <TextInput
                            placeholder="Título"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Descripción"
                            value={description}
                            onChangeText={setDescription}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Fecha de Entrega (DD/MM/AAAA)"
                            value={dueDate}
                            onChangeText={setDueDate}
                            style={styles.input}
                            keyboardType="numeric"
                        />
                        <Button title="Agregar Tarea" onPress={addTask} />
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    taskList: {
        marginTop: 20,
    },
    task: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    closeButton: {
        marginTop: 10,
        color: "blue",
    },
});