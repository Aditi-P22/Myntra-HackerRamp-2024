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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://192.168.29.11:3000/profile/${userId}`
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
      fetchPosts();
    }, [userId])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.11:3000/posts/user/${userId}`
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
        `http://192.168.29.11:3000/posts/${postId}/${userId}/like`
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
        `http://192.168.29.11:3000/posts/${postId}/${userId}/unlike`
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
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                }}
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
                  <Image
                    style={styles.avatar}
                    source={{
                      uri:
                        post.user.profilePicture ||
                        "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                    }}
                  />
                  <View style={styles.userDetails}>
                    <Text style={styles.username}>{post.user.name}</Text>
                    <Text style={styles.outfitName}>{post.outfitName}</Text>
                  </View>
                </View>

                <Text style={styles.description}>{post.description}</Text>

                <View style={styles.imageGrid}>
                  {post.images?.map((imageUrl, index) => (
                    <Image
                      key={index}
                      source={{ uri: imageUrl }}
                      style={styles.gridImage}
                    />
                  ))}
                </View>

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
                      name={post.likes?.includes(userId) ? "heart" : "hearto"}
                      size={18}
                      color={post.likes?.includes(userId) ? "red" : "black"}
                    />
                  </TouchableOpacity>

                  <FontAwesome name="comment-o" size={18} color="black" />
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="black"
                  />
                </View>
              </View>
            ))
          ) : (
            <Text>No created posts found.</Text>
          )}
        </View>
      ) : (
        <View style={styles.postsContainer}>
          {/* Render saved posts here */}
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
    padding: 15,
  },
  postCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userDetails: {
    marginLeft: 10,
  },
  username: {
    fontWeight: "bold",
  },
  outfitName: {
    color: "gray",
  },
  description: {
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  gridImage: {
    width: "48%", // Adjust as per your preference
    height: 150, // Adjust as per your preference
    marginBottom: 5,
    borderRadius: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  interactionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ProfileScreen;
