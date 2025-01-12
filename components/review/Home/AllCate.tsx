import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { GetAllCategories } from "../../../services/api";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";


interface Category {
  Id: string;
  Name: string;
}

const AllCate: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: Category[] = await GetAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.Id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("CategoryDetails", { categoryId: item.Id })}
            >
              <Text style={styles.cardText}>{item.Name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noCategoriesText}>No categories found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 100,
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  noCategoriesText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AllCate;
