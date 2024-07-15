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
  Switch,
  Button,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const ImageGrid = ({ images }) => {
  return (
    <View style={styles.imageGrid}>
      {images.slice(0, 4).map((imageUrl, i) => (
        <Image
          key={i}
          source={{ uri: imageUrl }}
          style={styles.imageGridImage}
        />
      ))}
    </View>
  );
};

const CollectionDetailScreen = ({
  route,
  navigation,
  collections,
  userId,
  handleLike,
  handleDislike,
  handleBookmarkClick,
}) => {
  const { collectionId } = route.params;
  const [collection, setCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [viewMode, setViewMode] = useState("default"); // Default view mode

  const fetchCollectionDetails = async (collectionId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://192.168.29.11:3000/collection/${collectionId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const collectionData = await response.json();
      setCollection(collectionData);
      setIsPublic(collectionData.isPublic); // Set the isPublic state
    } catch (error) {
      console.error("Error fetching collection details:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublicStatus = async () => {
    try {
      const response = await fetch(
        `http://192.168.29.11:3000/collection/${collectionId}/toggle-public`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPublic: !isPublic }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedCollection = await response.json();
      setIsPublic(updatedCollection.isPublic);
    } catch (error) {
      Alert.alert("Error", "Failed to update public status.");
    }
  };

  useEffect(() => {
    fetchCollectionDetails(collectionId);
  }, [collectionId]);

  const renderViewModeButtons = () => {
    return (
      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === "wide" && styles.activeButton,
          ]}
          onPress={() => setViewMode("wide")}
          disabled={viewMode === "wide"}
        >
          <Text
            style={[
              styles.buttonText,
              viewMode === "wide" && styles.activeButtonText,
            ]}
          >
            Wide View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === "default" && styles.activeButton,
          ]}
          onPress={() => setViewMode("default")}
          disabled={viewMode === "default"}
        >
          <Text
            style={[
              styles.buttonText,
              viewMode === "default" && styles.activeButtonText,
            ]}
          >
            Default View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === "compact" && styles.activeButton,
          ]}
          onPress={() => setViewMode("compact")}
          disabled={viewMode === "compact"}
        >
          <Text
            style={[
              styles.buttonText,
              viewMode === "compact" && styles.activeButtonText,
            ]}
          >
            Compact View
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderOutfitCards = () => {
    if (!collection || !collection.posts || collection.posts.length === 0) {
      return (
        <View style={styles.container}>
          <Text>No posts found in this collection</Text>
        </View>
      );
    }

    return (
      <View style={styles.outfitsContainer}>
        {collection.posts.map((post, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.outfitCard,
              viewMode === "wide" && styles.outfitCardWide,
              viewMode === "compact" && styles.outfitCardCompact,
            ]}
            onPress={() => {
              // Navigate to outfit details screen or perform action
            }}
          >
            {viewMode === "compact" ? (
              <View style={styles.postCardCompact}>
                <ImageGrid images={post.images} />
                <View style={styles.postContentCompact}>
                  <Text style={styles.outfitNameCompact}>
                    {post.outfitName}
                  </Text>
                  <Text style={styles.descriptionCompact}>
                    {post.description}
                  </Text>
                  <View style={styles.tagContainer}>
                    {post.tags.map((tag, index) => (
                      <Text key={index} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.imageContainer}>
                  {post.images.slice(0, 4).map((imageUrl, i) => (
                    <Image
                      key={i}
                      source={{ uri: imageUrl }}
                      style={[
                        styles.outfitImage,
                        viewMode === "wide" && styles.outfitImageWide,
                        viewMode === "compact" && styles.outfitImageCompact,
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.outfitDetails}>
                  <Text style={styles.outfitName}>{post.outfitName}</Text>
                  <Text style={styles.outfitDescription}>
                    {post.description}
                  </Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
        <Text style={styles.collectionName}>{collection?.name}</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.privacyText}>
            {isPublic ? "Public" : "Private"}
          </Text>
          <Switch onValueChange={togglePublicStatus} value={isPublic} />
        </View>
      </View>
      {renderViewModeButtons()}
      {renderOutfitCards()}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  collectionName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  viewModeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  viewModeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ECEAEA",
    borderRadius: 5,
    marginHorizontal: 5, // Added margin to space the buttons out
  },
  activeButton: {
    backgroundColor: "#fff",
    borderColor: "#ff3e6c",
    borderWidth: 1,
  },
  buttonText: {
    color: "#878787",
    fontSize: 14, // Reduced font size
  },
  activeButtonText: {
    color: "#ff3e6c",
  },
  outfitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  outfitCard: {
    width: "48%",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outfitCardWide: {
    width: "100%",
  },
  outfitCardCompact: {
    width: "100%",
    flexDirection: "row",
    padding: 10,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outfitImage: {
    width: "50%",
    height: 90,
  },
  outfitImageWide: {
    width: "50%",
    height: 200,
  },
  outfitImageCompact: {
    width: "40%",
    height: 60,
  },
  outfitDetails: {
    padding: 10,
  },
  outfitName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
  },
  outfitDescription: {
    fontSize: 14,
    color: "#666666",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  privacyText: {
    marginRight: 10,
    fontSize: 18,
    color: "#666666",
  },
  postCardCompact: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 1,
    backgroundColor: "white",
    marginBottom: 20,
    width: "100%",
    height: 120,
    justifyContent: "space-between",
  },
  postDetailsContainer: {
    flex: 1,
    padding: 10,
  },
  imageGrid: {
    width: 120,
    height: 120,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageGridImage: {
    width: "50%",
    height: "50%",
  },
  postImageGrid: {
    width: "50%",
    height: "50%",
    margin: 1,
  },
  postContentCompact: {
    flex: 1,
    paddingLeft: 30,
    justifyContent: "center",
  },
  outfitNameCompact: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
  },
  descriptionCompact: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#FFC0CB",
    color: "#ff3e6c",
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginRight: 5,
    fontSize: 12,
    marginBottom: 5,
  },
});

export default CollectionDetailScreen;
