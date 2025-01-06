import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { GetAllRepairServices } from "../../../services/api";
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface RepairService {
  Id: string;
  Image: string;
  Name: string;
  Description: string;
  Price: number;
  Active: boolean;
}

interface ApiResponse<T> {
  Data: T;
}

const ServiceCard = ({ service }: { service: RepairService }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: service.Image }} style={styles.image} />
      <Text style={styles.cardTitle}>{service.Name}</Text>
     
      <Text
        style={styles.cardPrice}
      >{`Price: ${service.Price.toLocaleString()} VND`}</Text>
    </TouchableOpacity>
  );
};

const PopularServices = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data: ApiResponse<RepairService[]> = await GetAllRepairServices({
          PageNumber: 1,
          PageSize: 3,
          Active: true,
        });
        setServices(data.Data);
        console.log("Services:", data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.popularText}>Popular Services</Text>
        <TouchableOpacity
          style={styles.sellAllButton}
          onPress={() => navigation.navigate("AllServices")}
        >
          <Text style={styles.sellAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        keyExtractor={(item) => item.Id}
        horizontal
        renderItem={({ item }) => <ServiceCard service={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  sellAllButton: {
    marginLeft: 10,
  },
  sellAllText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
  popularText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  list: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    textAlign: "center",
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#28a745",
  },
});

export default PopularServices;
