import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

export default function HomeScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [tasks, setTasks] = useState<{ title: string; description: string; dueDate: string }[]>([]);

    const addTask = () => {
        if (title && description && dueDate) {
            const newTask = { title, description, dueDate };
            setTasks([...tasks, newTask]);
            setTitle("");
            setDescription("");
            setDueDate("");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Agregar Tarea</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
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
});