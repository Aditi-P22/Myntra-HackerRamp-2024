import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [showCreated, setShowCreated] = useState(true); // Toggle between created and saved posts
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [collections, setCollections] = useState([]);

  const navigateToCollectionDetails = (collectionId) => {
    navigation.navigate("CollectionDetails", { collectionId });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.155:3000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProfile();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchCollections();
      fetchPosts();
    }, [userId])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.155:3000/posts/user/${userId}`
      );

      console.log("Response from fetchPosts:", response.data);

      if (Array.isArray(response.data)) {
        setPosts(response.data); // Set posts directly from response data
      } else {
        console.error("Posts data not found or is not an array");
        // Handle the scenario where response.data.posts is not an array
      }
    } catch (error) {
      console.error("Error fetching posts", error);
      // Handle fetch error, show error message to user or retry logic
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

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.replace("Login");
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

  const fetchPostsInCollection = async (collectionId) => {
    try {
      const response = await axios.get(
        `http://192.168.0.155:3000/collections/${collectionId}/posts`
      );

      // Handle response data, assuming posts are returned in response.data
      console.log("Posts in collection:", response.data);
      // Update state or perform other operations with fetched posts
    } catch (error) {
      console.error("Error fetching posts in collection:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ marginTop: 55, padding: 15 }}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {user?.name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              marginTop: 15,
            }}
          >
            <View>
              <Image
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  resizeMode: "contain",
                }}
                source={require("../assets/usergirl.png")}
              />
            </View>

            <View>
              <Text style={{ fontSize: 15, fontWeight: "400" }}>BTech.</Text>
              <Text style={{ fontSize: 15, fontWeight: "400" }}>
                Movie Buff | Musical Nerd
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "400" }}>
                Love Yourself
              </Text>
            </View>
          </View>
          <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
            {user?.followers?.length} followers
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 20,
            }}
          >
            <Pressable
              style={({ pressed }) => ({
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: pressed ? "#ff3e6c" : "transparent",
              })}
            >
              {({ pressed }) => (
                <Text style={{ color: pressed ? "#fff" : "#000" }}>
                  Edit Profile
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={logout}
              style={({ pressed }) => ({
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: pressed ? "#ff3e6c" : "transparent",
              })}
            >
              {({ pressed }) => (
                <Text style={{ color: pressed ? "#fff" : "#000" }}>Logout</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => setShowCreated(true)}
          style={[styles.tab, showCreated && styles.activeTab]}
        >
          <Text style={showCreated ? styles.activeTabText : styles.tabText}>
            Created Posts
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setShowCreated(false)}
          style={[styles.tab, !showCreated && styles.activeTab]}
        >
          <Text style={!showCreated ? styles.activeTabText : styles.tabText}>
            Saved Posts
          </Text>
        </Pressable>
      </View>

      {showCreated ? (
        <View style={styles.postsContainer}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <View key={post._id} style={styles.postCard}>
                <View style={styles.userInfo}>
                  {/* <Image
                    style={styles.avatar}
                    source={require("../assets/usergirl.png")}
                  /> */}
                  <View style={styles.userDetails}>
                    <Text style={styles.username}>{post.user.name}</Text>
                    {/* <Text style={styles.outfitName}>{post.outfitName}</Text> */}
                  </View>
                </View>

                {/* <Text style={styles.description}>{post.description}</Text> */}
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

                      <FontAwesome
                        name="bookmark-o"
                        size={16}
                        color="black"
                        style={styles.icon}
                      />
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
              </View>
            ))
          ) : (
            <Text>No posts available</Text>
          )}
        </View>
      ) : (
        <View style={styles.collectionsContainer}>
          {collections.length > 0 ? (
            collections.map((collection, index) => (
              <View key={index} style={styles.collectionWrapper}>
                <TouchableOpacity
                  key={collection._id}
                  style={styles.collectionCard}
                  onPress={() =>
                    navigation.navigate("CollectionDetails", {
                      userId: user._id,
                      collectionId: collection._id,
                    })
                  }
                >
                  <View style={styles.collectionImageContainer}>
                    {collection.posts.length > 0 &&
                    collection.posts[0].images ? (
                      collection.posts[0].images.length > 0 ? (
                        <View style={styles.collectionGrid}>
                          {collection.posts[0].images
                            .slice(0, 4)
                            .map((imageUrl, index) => (
                              <Image
                                key={index}
                                source={{ uri: imageUrl }}
                                style={styles.collectionImage}
                              />
                            ))}
                        </View>
                      ) : (
                        <Text>No images available</Text>
                      )
                    ) : (
                      <Text>No posts or images available</Text>
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.collectionName}>{collection.name}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noCollectionsText}>
              No collections available.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#ff3e6c",
  },
  tabText: {
    color: "gray",
  },
  activeTabText: {
    color: "#ff3e6c",
    fontWeight: "bold",
  },
  postsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 30,
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
    marginBottom: -15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  imagesContainer: {
    width: "35%", // Reduce width to make it smaller
    marginRight: 20,
    flexDirection: "row",
    marginTop: 15,
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
    // width: "35%",
    // height: 50,
    // marginBottom: 5,
    width: "100%",
    height: 50, // Reduce height to make it smaller
    marginBottom: 14,
    borderRadius: 0,
    marginTop: -12,
  },
  postContent: {
    flexDirection: "row", //yachya mule perfect rhatay, image chya side la text
  },
  userDetails: {
    marginLeft: 10,
  },
  username: {
    fontWeight: "bold",
  },
  outfitName: {
    fontSize: 13,
    color: "#555",
    fontWeight: "bold",
    marginTop: 0,
  },
  description: {
    fontSize: 12,
    marginBottom: 10,
    color: "#888",
  },
  // imageGrid: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   marginBottom: 10,
  //   marginRight: 20,
  // },
  // gridImage: {
  //   width: "32%", // Adjust as per your preference
  //   height: 50, // Adjust as per your preference
  //   marginBottom: 5,
  //   borderRadius: 10,
  // },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#FFC0CB",
    color: "#ff3e6c",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    fontSize: 12,
    marginBottom: 5,
  },
  interactionBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 2,
  },
  collectionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 20,
  },
  collectionWrapper: {
    width: "48%",
    alignItems: "center", // Center the text and card within the wrapper
    marginBottom: 20,
  },
  collectionCard: {
    width: "100%",
    aspectRatio: 1, // Ensures the card maintains a square aspect ratio
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  collectionImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  collectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
  },
  collectionImage: {
    width: "50%", // Each image takes up half the width
    height: "50%", // Each image takes up half the height
    resizeMode: "cover",
  },
  collectionName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  noCollectionsText: {
    alignSelf: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default ProfileScreen;
