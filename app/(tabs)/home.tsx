import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebase from "firebase/app";

export default function HomeScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [tasks, setTasks] = useState<{ id: string; title: string; description: string; dueDate: string }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            const q = query(collection(getFirestore(), 'tasks'), where("userId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as { id: string; title: string; description: string; dueDate: string }[];
                setTasks(tasks);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const addTask = async () => {
        if (title && description && dueDate && user) {
            const newTask = { title, description, dueDate, userId: user.uid };
            if (isEditing && currentTaskId) {
                await updateDoc(doc(getFirestore(), 'tasks', currentTaskId), newTask);
                setIsEditing(false);
                setCurrentTaskId(null);
            } else {
                await addDoc(collection(getFirestore(), 'tasks'), newTask);
            }
            setTitle(""); // Limpiar el input de título
            setDescription(""); // Limpiar el input de descripción
            setDueDate(""); // Limpiar el input de fecha de entrega
            setModalVisible(false);
            setErrorMessage(null); // Limpiar el mensaje de error
        } else {
            setErrorMessage("Todos los campos son obligatorios.");
        }
    };

    const editTask = (id: string) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setDueDate(task.dueDate);
            setIsEditing(true);
            setCurrentTaskId(id);
            setModalVisible(true);
        }
    };

    const confirmDeleteTask = (id: string) => {
        setTaskToDelete(id);
        setDeleteModalVisible(true);
    };

    const deleteTask = async () => {
        if (taskToDelete) {
            await deleteDoc(doc(getFirestore(), 'tasks', taskToDelete));
            setDeleteModalVisible(false);
            setTaskToDelete(null);
        }
    };

    const openAddTaskModal = () => {
        setTitle("");
        setDescription("");
        setDueDate("");
        setIsEditing(false);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Button title="Agregar Tarea" onPress={openAddTaskModal} />
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.task}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <Text>{item.description}</Text>
                        <Text>Fecha de entrega: {item.dueDate}</Text>
                        <View style={styles.taskButtons}>
                            <TouchableOpacity onPress={() => editTask(item.id)} style={styles.editButton}>
                                <Ionicons name="pencil" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDeleteTask(item.id)} style={styles.deleteButton}>
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
                        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                        <Button title={isEditing ? "Guardar Cambios" : "Agregar Tarea"} onPress={addTask} />
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text>¿Estás seguro de que deseas eliminar esta tarea?</Text>
                        <View style={styles.confirmButtons}>
                            <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.cancelButton}>
                                <Ionicons name="close" size={20} color="white" />
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={deleteTask} style={styles.confirmButton}>
                                <Ionicons name="checkmark" size={20} color="white" />
                                <Text style={styles.buttonText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
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
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginTop: 5,
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
        width: '90%',
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    closeButton: {
        marginTop: 10,
        color: "blue",
    },
    confirmButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    confirmButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});