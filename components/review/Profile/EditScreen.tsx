import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ViewUser, UpdateUser } from "../../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Button, Modal, Portal } from "react-native-paper";
import DatePicker from "react-native-modern-datepicker";

type RootStackParamList = {
  EditScreen: { field: string; value: string };
  YourProfile: { refresh: boolean };
};

type EditScreenProps = NativeStackScreenProps<RootStackParamList, "EditScreen">;

const EditScreen: React.FC<EditScreenProps> = ({ route, navigation }) => {
  const { field, value } = route.params;
  const [inputValue, setInputValue] = useState<string>(value || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");
        const data = await ViewUser(userId);
        setUserData(data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!userData) {
      Alert.alert("Error", "User data is not loaded yet.");
      return;
    }

    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const updatedUserData = { ...userData, [field]: inputValue };
      await UpdateUser(userId, updatedUserData);

      navigation.navigate("YourProfile", { refresh: true });
    } catch {
      Alert.alert("Error", "Failed to update user information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{field}</Text>
      {field === "Gender" ? (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.selectText}>{inputValue || "None"}</Text>
          </TouchableOpacity>

          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <TouchableOpacity
                onPress={() => {
                  setInputValue("Male");
                  setModalVisible(false);
                }}
                style={styles.option}
              >
                <Text style={styles.optionText}>Male</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setInputValue("Female");
                  setModalVisible(false);
                }}
                style={styles.option}
              >
                <Text style={styles.optionText}>Female</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.option}
              >
                <Text style={styles.cancelOption}>Cancel</Text>
              </TouchableOpacity>
            </Modal>
          </Portal>
        </>
      ) : field === "Birthday" ? (
        <DatePicker
          options={{
            backgroundColor: "#090C08",
            textHeaderColor: "#FFA25B",
            textDefaultColor: "#F6E7C1",
            selectedTextColor: "#fff",
            mainColor: "#F4722B",
            textSecondaryColor: "#D6C7A1",
            borderColor: "rgba(122, 146, 165, 0.1)",
          }}
          current={inputValue || "2020-07-13"}
          selected={inputValue}
          mode="calendar"
          onDateChange={(date) => setInputValue(date)}
          style={{ borderRadius: 10 }}
        />
      ) : (
        <TextInput
          mode="outlined"
          value={inputValue}
          onChangeText={setInputValue}
          style={styles.textInput}
          label={`Enter ${field}`}
        />
      )}

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.saveButton}
      >
        Save
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectText: {
    fontSize: 16,
    color: "#007BFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    position: "absolute",
    bottom: 0,
    width: "90%",
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 18,
    color: "#007BFF",
    textAlign: "center",
  },
  cancelOption: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  textInput: {
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  saveButton: {
    marginTop: 20,
  },
});

export default EditScreen;
