import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { ViewUser } from "../../../services/api";
import { UserData } from "../../../types/UserData";
import styles from "../../../styles/YourProfile.styles"; // Import styles từ file riêng

const YourProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const Id = await AsyncStorage.getItem("userId");
      if (Id) {
        const data: UserData = await ViewUser(Id);
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!userData) {
    return <Text>Error loading user data</Text>;
  }

  const handleEdit = (field: string, value: string) => {
    navigation.navigate("EditScreen", { field, value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: userData.Avatar }} style={styles.avatar} />
        <TouchableOpacity>
         
          {renderImg("Change avatar", "", () => handleEdit("Avatar", userData.Avatar || ""))}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {renderRow("Name", userData.Fullname || "Set Now", () => handleEdit("Fullname", userData.Fullname || ""))}
        {renderRow("Phone Number", maskPhoneNumber(userData.PhoneNumber), () => handleEdit("PhoneNumber", userData.PhoneNumber))}
        {renderRow("Gender", userData.Gender || "Set Now", () => handleEdit("Gender", userData.Gender || ""))}
        {renderRow("Date of Birth", userData.Birthday || "Set Now", () => handleEdit("Birthday", userData.Birthday || ""))}
        {renderRow("Address", userData.Address || "Set Now", () => handleEdit("Address", userData.Address || ""))}
      </View>
    </View>
  );
};

const renderRow = (label: string, value: string, onPress: () => void) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <Text style={styles.rowLabel}>{label}</Text>
    <View style={styles.rowValueContainer}>
      <Text style={[styles.rowValue, value === "Set Now" ? styles.placeholder : styles.filledValue]}>
        {value}
      </Text>
      <FontAwesome name="chevron-right" size={20} color="#ccc" />
    </View>
  </TouchableOpacity>
);
const renderImg = (label: string, value: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress}>
     
     <Text style={styles.changeAvatar}>Change avatar</Text>
        
      
    </TouchableOpacity>
  );

const maskPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/.(?=.{4})/g, "*");
};

export default YourProfile;
