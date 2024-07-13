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
                  uri: "data:image/png;base64,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",
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
                      uri: post.user.profilePicture,
                    }}
                  />
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
    marginTop: -7,
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
});

export default ProfileScreen;
