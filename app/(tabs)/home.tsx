import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"

export default function HomeScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [tasks, setTasks] = useState<{ title: string; description: string; dueDate: string }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);

    const addTask = () => {
        if (title && description && dueDate) {
            const newTask = { title, description, dueDate };
            if (isEditing && currentTaskIndex !== null) {
                const updatedTasks = [...tasks];
                updatedTasks[currentTaskIndex] = newTask;
                setTasks(updatedTasks);
                setIsEditing(false);
                setCurrentTaskIndex(null);
            } else {
                setTasks([...tasks, newTask]);
            }
            setTitle("");
            setDescription("");
            setDueDate("");
            setModalVisible(false);
        }
    };

    const editTask = (index: number) => {
        const task = tasks[index];
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.dueDate);
        setIsEditing(true);
        setCurrentTaskIndex(index);
        setModalVisible(true);
    };

    const deleteTask = (index: number) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    return (
        <View style={styles.container}>
            <Button title="Agregar Tarea" onPress={() => setModalVisible(true)} />
            <FlatList
                data={tasks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.task}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <Text>{item.description}</Text>
                        <Text>{item.dueDate}</Text>
                        <View style={styles.taskButtons}>
                            <TouchableOpacity onPress={() => editTask(index)} style={styles.editButton}>
                                <Ionicons name="pencil" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteTask(index)} style={styles.deleteButton}>
                                <Ionicons name="trash" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
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
                            style={[styles.input, styles.descriptionInput]}
                            multiline
                        />
                        <TextInput
                            placeholder="Fecha de Entrega (DD/MM/AAAA)"
                            value={dueDate}
                            onChangeText={setDueDate}
                            style={styles.input}
                            keyboardType="numeric"
                        />
                        <Button title={isEditing ? "Guardar Cambios" : "Agregar Tarea"} onPress={addTask} />
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
        width: '100%',
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
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
    taskButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    editButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
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