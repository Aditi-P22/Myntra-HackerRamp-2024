import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

const CollectionDetailScreen = ({ route, navigation }) => {
  const { collectionId } = route.params; // collectionId should be passed directly
  const [collection, setCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollectionDetails = async (collectionId) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching details for collection with ID: ${collectionId}`);
      const response = await fetch(
        `http://192.168.29.11:3000/collection/${collectionId}` // Updated endpoint
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const collection = await response.json();
      console.log(`Collection fetched successfully:`, collection);

      setCollection(collection);
      console.log(`Collection state updated:`, collection);
    } catch (error) {
      console.error("Error fetching collection details:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { collectionId } = route.params;
    console.log("Received params:", collectionId); // Check if collectionId is received correctly

    fetchCollectionDetails(collectionId);
  }, [route.params]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error fetching collection details: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.collectionHeader}>
        <Text style={styles.collectionName}>{collection.name}</Text>
      </View>

      <View style={styles.outfitsContainer}>
        {collection.posts.map((post, index) => (
          <TouchableOpacity
            key={index}
            style={styles.outfitCard}
            onPress={() => {
              // Navigate to outfit details screen or perform action
            }}
          >
            <Image
              source={{ uri: post.images[0] }}
              style={styles.outfitImage}
              resizeMode="cover"
            />
            <View style={styles.outfitDetails}>
              <Text style={styles.outfitName}>{post.outfitName}</Text>
              <Text style={styles.outfitDescription}>{post.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  collectionHeader: {
    marginBottom: 20,
  },
  collectionName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  outfitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  outfitCard: {
    width: "48%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  outfitImage: {
    width: "100%",
    height: 200,
  },
  outfitDetails: {
    padding: 10,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  outfitDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default CollectionDetailScreen;
