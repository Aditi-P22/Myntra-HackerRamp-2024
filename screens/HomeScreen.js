// import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
// import React, { useEffect, useContext, useState, useCallback } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import jwt_decode from "jwt-decode";
// import { UserType } from "../UserContext";
// import axios from "axios";
// import { AntDesign } from "@expo/vector-icons";
// import { FontAwesome } from "@expo/vector-icons";
// import { Ionicons } from "@expo/vector-icons";
// import { useFocusEffect } from "@react-navigation/native";

// const HomeScreen = () => {
//   const { userId, setUserId } = useContext(UserType);
//   const [posts, setPosts] = useState([]);
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = await AsyncStorage.getItem("authToken");
//       const decodedToken = jwt_decode(token);
//       const userId = decodedToken.userId;
//       setUserId(userId);
//     };

//     fetchUsers();
//   }, []);
//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchPosts();
//     }, [])
//   );

//   const fetchPosts = async () => {
//     try {
//       const response = await axios.get("http://192.168.29.11:3000/get-posts");
//       setPosts(response.data);
//     } catch (error) {
//       console.log("error fetching posts", error);
//     }
//   };

//   console.log("posts", posts);
//   const handleLike = async (postId) => {
//     try {
//       const response = await axios.put(
//         `http://192.168.29.11:3000/posts/${postId}/${userId}/like`
//       );
//       const updatedPost = response.data;

//       const updatedPosts = posts?.map((post) =>
//         post?._id === updatedPost._id ? updatedPost : post
//       );

//       setPosts(updatedPosts);
//     } catch (error) {
//       console.log("Error liking the post", error);
//     }
//   };

//   const handleDislike = async (postId) => {
//     try {
//       const response = await axios.put(
//         `http://192.168.29.11:3000/posts/${postId}/${userId}/unlike`
//       );
//       const updatedPost = response.data;
//       // Update the posts array with the updated post
//       const updatedPosts = posts.map((post) =>
//         post._id === updatedPost._id ? updatedPost : post
//       );
//       console.log("updated ", updatedPosts);

//       setPosts(updatedPosts);
//     } catch (error) {
//       console.error("Error unliking post:", error);
//     }
//   };
//   return (
//     <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
//       <View style={{ alignItems: "center", marginTop: 20 }}>
//         <Image
//           style={{ width: 60, height: 40, resizeMode: "contain" }}
//           source={{
//             uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
//           }}
//         />
//       </View>

//       <View style={{ marginTop: 20 }}>
//         {posts?.map((post) => (
//           <View
//             style={{
//               padding: 15,
//               borderColor: "#D0D0D0",
//               borderTopWidth: 1,
//               flexDirection: "row",
//               gap: 10,
//               marginVertical: 10,
//             }}
//           >
//             <View>
//               <Image
//                 style={{
//                   width: 40,
//                   height: 40,
//                   borderRadius: 20,
//                   resizeMode: "contain",
//                 }}
//                 source={{
//                   uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
//                 }}
//               />
//             </View>

//             <View>
//               <Text
//                 style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}
//               >
//                 {post?.user?.name}
//               </Text>
//               <Text>{post?.content}</Text>

//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   gap: 10,
//                   marginTop: 15,
//                 }}
//               >
//                 {post?.likes?.includes(userId) ? (
//                   <AntDesign
//                     onPress={() => handleDislike(post?._id)}
//                     name="heart"
//                     size={18}
//                     color="red"
//                   />
//                 ) : (
//                   <AntDesign
//                     onPress={() => handleLike(post?._id)}
//                     name="hearto"
//                     size={18}
//                     color="black"
//                   />
//                 )}

//                 <FontAwesome name="comment-o" size={18} color="black" />

//                 <Ionicons name="share-social-outline" size={18} color="black" />
//               </View>

//               <Text style={{ marginTop: 7, color: "gray" }}>
//                 {post?.likes?.length} likes • {post?.replies?.length} reply
//               </Text>
//             </View>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({});

import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);

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
      const response = await axios.get("http://192.168.29.11:3000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>

      <View style={styles.postsContainer}>
        {posts.map((post) => (
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

            {post.images?.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScroll}
              >
                {post.images.map((imageUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    style={styles.postImage}
                  />
                ))}
              </ScrollView>
            )}

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
              <Ionicons name="share-social-outline" size={18} color="black" />
            </View>

            <Text style={styles.interactionText}>
              {post.likes?.length} likes • {post.replies?.length} replies
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  postsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  postCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
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
    resizeMode: "cover",
    marginRight: 10,
  },
  userDetails: {
    flexDirection: "column",
  },
  username: {
    fontSize: 15,
    fontWeight: "bold",
  },
  outfitName: {
    fontSize: 13,
    color: "#888",
  },
  description: {
    marginBottom: 10,
    color: "#555",
  },
  imageScroll: {
    marginTop: 10,
    marginBottom: 10,
  },
  postImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#FFC0CB",
    color: "white",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    fontSize: 12,
    marginBottom: 5,
  },
  interactionBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  interactionText: {
    marginTop: 5,
    color: "gray",
  },
});

export default HomeScreen;
