import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Button } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { GetRepairServiceById } from "../../../services/api";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

type RootStackParamList = {
  ServiceDetails: { serviceId: string };
  PaymentScreen: { userId: string; serviceId: string; price: number };
};

type ServiceDetailsProps = {
  route: RouteProp<RootStackParamList, "ServiceDetails">;
};

interface RepairServiceDetail {
  Id: string;
  Image: string;
  Name: string;
  Description: string;
  Price: number;
  Active: boolean;
}

const ServiceDetails = ({ route }: ServiceDetailsProps) => {
  const { serviceId } = route.params;
  const [serviceDetails, setServiceDetails] = useState<RepairServiceDetail | null>(null);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const data = await GetRepairServiceById(serviceId);
        setServiceDetails(data);
      } catch (error) {
        console.error("Failed to fetch service details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const handlePayment = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId && serviceDetails) {
        navigation.navigate("PaymentScreen", { 
          userId, 
          serviceId, 
          price: serviceDetails.Price // Gửi thêm giá
        });
      } else {
        console.error("User ID not found in AsyncStorage or service details missing");
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
    }
  };
  

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!serviceDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Service not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: serviceDetails.Image }} style={styles.image} />
      <Text style={styles.title}>{serviceDetails.Name}</Text>
      <Text style={styles.description}>{serviceDetails.Description}</Text>
      <Text style={styles.price}>{`Price: ${serviceDetails.Price.toLocaleString()} VND`}</Text>
      <Button title="Thanh toán" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default ServiceDetails;
