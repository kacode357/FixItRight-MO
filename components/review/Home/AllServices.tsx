import { useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import SearchResults from "./SearchResults";

const AllServices = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search services..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Text style={styles.text}>All Services</Text>
      <SearchResults query={searchQuery} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AllServices;
