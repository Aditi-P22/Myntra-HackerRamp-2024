import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header"; // Import the Header component

const HomeScreen = ({ route }) => {
  const {
    selectedTops = [],
    selectedBottoms = [],
    selectedFootwear = [],
    selectedAccessories = [],
  } = route.params || {};

  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCollectionModalVisible, setNewCollectionModalVisible] =
    useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  //added
  const [shopModalVisible, setShopModalVisible] = useState(false); // New state for Shop the Look modal
  const [selectedPost, setSelectedPost] = useState(null); // New state for the selected post

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://192.168.0.155:3000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://192.168.0.155:3000/posts/${postId}/${userId}/like`
      );
      const updatedPost = response.data;

      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `http://192.168.0.155:3000/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;

      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error disliking the post", error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.155:3000/collections/${userId}`
      );
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const handleBookmarkClick = async (postId) => {
    console.log("Bookmarking post with ID:", postId); // Debugging
    setSelectedPostId(postId);
    await fetchCollections();
    setModalVisible(true);
  };

  const handleSaveToCollection = async (collectionName) => {
    try {
      await axios.post("http://192.168.0.155:3000/addPostToCollection", {
        userId,
        collectionName,
        postId: selectedPostId,
      });
      setModalVisible(false);
      alert("Post added to collection");
    } catch (error) {
      console.error("Error saving post to collection:", error);
      alert("Failed to save post to collection");
    }
  };

  const handleCreateNewCollection = async () => {
    setNewCollectionModalVisible(true);
  };

  const handleNewCollectionSubmit = async () => {
    try {
      await axios.post("http://192.168.0.155:3000/createCollection", {
        userId,
        collectionName: newCollectionName,
        postId: selectedPostId, // Ensure this is sent
      });
      setNewCollectionModalVisible(false);
      setModalVisible(false);
      alert("New collection created and post added");
    } catch (error) {
      console.error("Error creating new collection:", error);
      alert("Failed to create new collection and save post");
    }
  };

  //added
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShopModalVisible(true);
  };

  const handleShopLook = () => {
    setShopModalVisible(false);
    alert("All the items from the outfit were added to your cart!");
    // Here, you can add the logic to add items to the cart
  };

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        {/* <View style={styles.header}>
        <Image
          style={styles.logo}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJaZFxwPVRLp4lnm6GtAt154e86wb-5A9QSA&s",
          }}
        />
      </View> */}

        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post._id} style={styles.postCard}>
              <View style={styles.userInfo}>
                <Image
                  style={styles.avatar}
                  source={require("../assets/usergirl.png")}
                />

                <View style={styles.userDetails}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("OtherUserProfileScreen", {
                        userId: post.user._id,
                      })
                    }
                  >
                    <Text style={styles.username}>{post.user.name}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* //added */}
              <TouchableOpacity onPress={() => handlePostClick(post)}>
                <View style={styles.postContent}>
                  {post.images?.length > 0 && (
                    <View style={styles.imagesContainer}>
                      <View style={styles.leftImages}>
                        {post.images.slice(0, 2).map((imageUrl, index) => (
                          <Image
                            key={index}
                            source={{ uri: imageUrl }}
                            style={styles.postImage}
                          />
                        ))}
                      </View>
                      <View style={styles.rightImages}>
                        {post.images.slice(2, 4).map((imageUrl, index) => (
                          <Image
                            key={index}
                            source={{ uri: imageUrl }}
                            style={styles.postImage}
                          />
                        ))}
                      </View>
                    </View>
                  )}
                  <View style={styles.textContainer}>
                    <Text style={styles.outfitName}>{post.outfitName}</Text>
                    <Text style={styles.description}>{post.description}</Text>

                    <View style={styles.tagContainer}>
                      {post.tags.map((tag, index) => (
                        <Text key={index} style={styles.tag}>
                          {tag}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.interactionBar}>
                      <TouchableOpacity
                        onPress={() =>
                          post.likes?.includes(userId)
                            ? handleDislike(post._id)
                            : handleLike(post._id)
                        }
                      >
                        <AntDesign
                          name={
                            post.likes?.includes(userId) ? "heart" : "hearto"
                          }
                          size={16}
                          color={post.likes?.includes(userId) ? "red" : "black"}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleBookmarkClick(post._id)}
                      >
                        <Ionicons
                          name="bookmark-outline"
                          size={16}
                          color="black"
                        />
                      </TouchableOpacity>
                      <Ionicons
                        name="paper-plane-outline"
                        size={16}
                        color="black"
                        style={styles.icon}
                      />
                    </View>

                    <Text style={styles.interactionText}>
                      {post.likes?.length} likes • {post.replies?.length} shares
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Modal for selecting existing collection or creating new collection */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Save to Collection</Text>
              <FlatList
                data={collections}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.collectionItem}
                    onPress={() => handleSaveToCollection(item.name)}
                  >
                    <Text style={styles.collectionName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.newCollectionButton}
                onPress={handleCreateNewCollection}
              >
                <Text style={styles.newCollectionButtonText}>
                  Create New Collection
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal for creating new collection */}
        <Modal
          visible={newCollectionModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setNewCollectionModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Collection</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter collection name"
                onChangeText={(text) => setNewCollectionName(text)}
                value={newCollectionName}
              />
              <TouchableOpacity
                style={styles.createCollectionButton}
                onPress={handleNewCollectionSubmit}
              >
                <Text style={styles.createCollectionButtonText}>
                  Create Collection
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setNewCollectionModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={shopModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShopModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Shop the Look</Text>
              {selectedPost &&
              selectedPost.images &&
              selectedPost.images.length > 0 ? (
                <ScrollView horizontal style={styles.imageSlider}>
                  {selectedPost.images.map((imageUrl, index) => (
                    <Image
                      key={index}
                      source={{ uri: imageUrl }}
                      style={styles.sliderImage}
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text>No images available</Text>
              )}

              {/* {selectedPost &&
            selectedPost.products &&
            selectedPost.products.length > 0 ? (
              <ScrollView horizontal style={styles.imageSlider}>
                {selectedPost.products.map((product, index) => (
                  <View key={index} style={styles.productCard}>
                    <Image
                      source={{ uri: product.url }}
                      style={styles.sliderImage}
                    />
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.brand}>{product.brand}</Text>
                    <Text style={styles.price}>
                      ${product.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text>No products available</Text>
            )} */}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.shopButton}
                  onPress={handleShopLook}
                >
                  <Text style={styles.shopButtonText}>Shop the Look</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShopModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "white",
  },
  logo: {
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  postsContainer: {
    flex: 1,
    marginTop: 85,
    paddingHorizontal: 20,
  },
  postCard: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: "white",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    resizeMode: "cover",
    marginRight: 10,
    marginLeft: 120,
  },
  userDetails: {
    flexDirection: "column",
  },
  username: {
    fontSize: 15,
    fontWeight: "bold",
  },
  postContent: {
    flexDirection: "row", //yachya mule perfect rhatay, image chya side la text
  },
  imagesContainer: {
    width: "35%", // Reduce width to make it smaller
    marginRight: 20,
    flexDirection: "row",
  },
  leftImages: {
    flex: 1,
    marginRight: 2,
  },
  rightImages: {
    flex: 1,
    marginLeft: 1,
  },
  postImage: {
    width: "100%",
    height: 50, // Reduce height to make it smaller
    marginBottom: 14,
    borderRadius: 0,
    marginTop: -12,
  },
  textContainer: {
    flex: 1,
  },
  outfitName: {
    fontSize: 13,
    color: "#555",
    fontWeight: "bold",
    marginTop: -5,
  },
  description: {
    fontSize: 12,
    marginBottom: 10,
    color: "#888",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#FFC0CB", //#FFC0CB
    color: "#ff3e6c",
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginRight: 5,
    fontSize: 12,
    marginBottom: 5,
  },
  interactionBar: {
    flexDirection: "row",
    alignItems: "left",
    marginTop: -1,
  },
  icon: {
    marginRight: 1,
    marginLeft: 1,
  },
  interactionText: {
    marginTop: 5,
    color: "gray",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background
  },
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%", // Make the modal cover half the screen height
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  collectionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  collectionName: {
    fontSize: 16,
  },
  newCollectionButton: {
    padding: 15,
    backgroundColor: "#D3D3D3",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  newCollectionButtonText: {
    color: "white",
    fontSize: 16,
  },
  createCollectionButton: {
    padding: 15,
    backgroundColor: "#D3D3D3",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  createCollectionButtonText: {
    color: "white",
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 5,
  },
  closeButton: {
    padding: 15,
    backgroundColor: "#ff3e6c",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 15,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  imageSlider: {
    marginVertical: 16,
  },
  sliderImage: {
    width: 150,
    height: 150,
    marginRight: 8,
    borderRadius: 8,
  },
  shopButton: {
    backgroundColor: "#6c757d",
    // paddingVertical: 8, // Reduced padding
    // paddingHorizontal: 16, // Reduced padding
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 6,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10, // Add bottom margin to shift down
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 16,
  },
  productCard: {
    width: 200,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  price: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ff3e6c",
  },
  name: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  brand: {
    fontSize: 12,
    color: "gray",
  },
});

export default HomeScreen;
