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

  // const fetchPosts = async () => {
  //   try {
  //     const response = await axios.get("http://192.168.0.155:3000/posts");
  //     setPosts(response.data);
  //   } catch (error) {
  //     console.error("Error fetching posts", error);
  //   }
  // };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://192.168.0.155:3000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error(
        "Error fetching posts",
        error.response || error.message || error
      );
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJaZFxwPVRLp4lnm6GtAt154e86wb-5A9QSA&s",
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
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABmCAYAAABGDvaTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFxEAABcRAcom8z8AAA37SURBVHhe7Z15cJT1GcfTTmfsdNpOO9POtDP9w46VS7GxoUpFEa31QIoRMYJWwWTf3QQMEjkkiHIIRik3yFlNOGIISQyQkOz7LskiyCGHUZTL0kFBZVAw2SMkuwn59Xne/SXsbp5s9vj99gh8Zz6TwHs9z3d/+7y/491NUqKJzbT+pN5UfSPCxlh/yv/7usJVo6HqDzaDeZjNaJ7oMKmr7EbN4lC0Mw6jWu8waoxEUR36Poq6B1hnU8yT7UZzKr4o/LTX1S7nuMrfgUmj0Fww7QRpaCToL5aWbzOoY6/ZF6BJqbkJWm4mGFEKhth8DJKLC17cSrjmi/YsrS8Pp+fKaVCTnYq2US8BtCFRw25Um+BFL3JkVA/h4fUc2Q3q45DcJqjDTVTyscSuqG3ws8Rh0kZ/kV11Aw85MdVg1AZAQlb/JOMVaBR1CdniHYaaW8DoBVA6LlKJxTmXgbexsfB04lvY47Ar2nm/JBIQtd5u0DJ5WvEnp1L9e2zVcDPCmkgkkJhAPsubTNb46k42GNQU6H0UUgH3BGyKWgaDqbt4urGVM9MyLJFujGGjaPvsJnUkTzs2shstRqh1p8gAeyTqlw6jJZunHz21pX/4C7g5zoKWHfMBTLSBnN3Q2vOY0fobbod86aNFIphrjBKcueSWyBN0+V4hLn5toqjzuC1y5DRqz8NFfiAvfg0CI1OXtJreYDQ/DBf4nLrwNQ7cSLUnuU1i5Mioug1KieZ3oeu0o2gHoMd2N7crMtnhbgwnLeh0kShxIaOK7XjiXTbt3tfZU3+dzIbcNo717T2WpfQzsLcfWUIeEwtgcLS1IcP8J25b+IIT5VEXkM32Ee/oBvfq9Ry76eZnuwRfDOr4mGBSV10Yt+Xn3LrQhXWbPLFE0Oiht08gzaUYP+hV/bjTY7bq7wb/80WbsCe8cP0P+tu11EllcPjp4pCMbqcflBfvdwH+fk//LDZywCS26KGF7KPRReT1ZAEDo6ONWWoKtzF44UiSOqEMsFX37/O8j5EiuetWEyscvoo1KCp5fdFAB2MFtzE4YfHHNT/qZCK5aKhmCx9cyP7cN500SjT4DrKmbSRjEU1IvRbo5qyhTiKaCXe/Rhojk4G3GNnaocvIeATzPpvJfswt7VoOxXyfwyh/aWzJQ4tIQ6LF6qFLybgE0/2ACOsPcaBQ9o56r9vunmxu65POioavJuMTBdxAi7mttPTaragt1MEiwR4EZUK0SU3Jkd6LCVjLoXa/Th0kEuyRUMl3R//+6exfI19m86bMZ2Ur/8PW5a0g9wsVHMFScYoCBo7ruL2+wkUFKCcHqINEkjloBpl4V4x6fCpb+8YKdnrndtZybFcHx6vLyf1DBacJvk2vJGMVgqKdsZm0m7nNV2U3aiPIAwSCI0FMkErcnxHDJrHqd9f7mOzPnXcYyWNDRfacDDTkLG7zVcErsZLaWSSbH1tDJuxNv35j2Zp5y1nz0VrSZG9yx88lzxEqYwZOI+MVhmIp4zZ7hEtFMLKUvj6Z98B8MuF2xo15le0qLCTNpShaupY8T6gM6p/JzqfvIGMWBT6Wze3G1m15gNpJNDn3zCITRmZMeIOd31tNGtsVuD91rnA4OHozGbMonIr2LLcb67d5GrWTaLrqDmLLDqaEUKQNn0yeM1RkD4Sgji/lduv1u4TaSTQPJr/QKdFIzEYKF3d/XwiGFbJvnEZ1L7cbDY/O8yU4leqd5IT0mezrPVWkkcHy3X4zMzz9is95w2HZw4vJmEWCq2f6eiW1UQbeho+G/vUn20tJE0PlcPkW1qvPGB8DQyUacyu2DG0o1u9UaqMMbuntmfNGc9Akyrxwwa6kv4mhEJ3JLHU8lpMceqN4kvtm6Mm99mIeaVqk5BhmdzIyWDYNX0XGLBKnoi5Ispu0ZdRGGQzop7CUvxiY7YiFNCxSLh3U2FvTFrCbe4c+E1kx4h0yZsG8j0N6C7FBCn+71cQWzVhEmiWSjYtWs+Rkz7spWKKyEqRoJ5Lsiip/oThbY00ba9h7b61hzk9qSJNEgzfkuZPns4F3mEiDvRmblsv+u2wbc2QSsYtEUU+j4YfIjQJx1Vg7jGj+7Orv0eBLayUr+PdKNvapXH2K199svIHjPrhvc3ktGb8oYPBzAQ0/SW0UhfMlXq8/tzJXNXQDP41OC6fAdxf2jvYWF3VQV1bMXJZyzz5Hd0lt5eD1ZRxl4mfRyR1E0DjHY7j7gwrWvOFd5t4X2UBHNBiPHtd+zzyOc7KFzEMUuIZ5ltogCud0brh1mycxMN474VjT0RD27tD/7YT7DZWHKLAffozaIIwsjbkPQ2LQgjAxvaz4JR1LXFWlelwtH1uYe7eVzkEQUFIc2MKlL6s1rYe6DTdLV3kRc5UFP98tnaO1zFWyibm2F+v/blpdQ8YvCvD6W+iHq9L74c6pUFbghuTeU8mai9Yz9yG1c/IxwL0f6veWjXoddx4EsyWXE/zEXxL8UtF5g3iw9ehJfrhDN94/+Vjgqt3G3B+ZWf0hjb2ds5RdMlSTsYsCvzwBSop5PrVRBtVr+KJwDLuGHeAc/Geeefhls5boffLZ9+dJfeATSkohDu3xm3nIHUSDjxGvnLOsc/IxAhc+cCLNeyCEq1I4c6iOLCBziAx1bpLToD1EbxQPGo5J4VD6mwgXHiIBB0Cn1K1sxKP0kh8+hpc/bAWZQyTYDWpGks1g6UVtlEG74Qg+DnFut6fvG20q1xX4GOyN1EealZ336UtsUFui8v0m3oYjUzLnsKYI1jPDAZ/YepJYeMZHOOSUEQ/QB2+5MM7q+fwPGJ5P7SQaf8OR9QtWkcbIYuZE35rdjuzpWeh+m3WzUbj0Q+0kGsrwR//xIjtSXkKaI5rNS9ey3n3ptU/58+GWudzupKRGRb2T3kkslOEIPlvirJPbVTylbmMDUhTy+oj0Fm5QH+d2ewTdw3PUjiLpynAEnxPERx4osyJl/5bNLO2xwA8MyTQcPy/VUb/bhU2e2lkkgQxH5kx6iznqdpKmhQuu/IyBbih1PW+ktnDqGXG4cd4Lr4SLPEAQ3RmOTH9hHjtWxRcEIkQr2MCee3IaeR1/pBpu0NK4zb6CjVLnVYIxHBmVOoVVrM0nTQyGy5/W6g/xDx4U3PUQWYbjEmZDVuWvucW+wo8tUweJIljDEVxrnP3Sm+zbEEekddtKWcbo6eQ5AyGthStaHre3s+oN6h/hFTlCHiiAUAxvZ9TQHOaqKGbuA9X6nDplMk5C4YrNwimBnz8PhAzDoUyfbTTtvIPbS8tpUnOpg0UQjuH//Hu2vkiAqzI6mzcw1/vvMdeOEv0nzq/r/19YwJ7ppicSCDmGq4u5rV0L51Zgx6PUCSIlHMPTUl/WWzHOW7sqtzBXKZi/qcBjMpjt2lrE3NbteiufMv5N8hzBINpw6Gaftxurgvv4t03SFxsEa/ic3BVsX0U1cx7bx9wn9nQuIQHA/U9+UMPyl24gz90VElp4Preze+E32MMBu/1OEDGBDE974pUOkykjw2VXaXlQvRWxhqvHcfTO7QxONsWcTp8sfCjDB9+TzT6rrQm5JYdKd8aLNBxK8lRuY/BijP0IDhb6XVf+hhet3cyaT+wlDZLF1oISnxjaEWa4olbas3f/ltsYmvCz93ACYR9HaTf89hQTKy3bza6cP02aIpMr351hBz46IcVwaNktNoM2kNsXnuwmNQNO1vXf0AkBNBzN1iyH4Q3EWJv9e9IUmbQ56/VrHz/+FRs8JEeo4TDImcRti0zwyr1KXiBEnh85j537+ns9YV2tLazl5IekMVKAa3nLZmtkTz8zT4jh4NECblfkYsbtP4Ou4irqQsFyecEh5rBf5qleVes3J2lzJNB69nN+VV9lZi2JyHDoc29yjrNe/aSxCOn13Kht9b9YMDTm7mFtjS08PT9hKyfMEQ607vZy4i9s6YemhveNEtCyd9ZnWm7nNomV3agOhj7mQerCXeGcWMtaT/3AU6MVjVaON8tAavrOQcYfEEU95lTUR7g9ctSg/xUT9WsyAAL3zq94SoHVeuYT0igRtP4PbtLwTupO2DCoHLrgEn7bNLdFruwGdSQuGxFB+NCUT9dMUmAIGkMZFhFYSpoc/CLdq7n4JJmLN9j9i/qfnME/QAHlZT8VEBKwbncl0aaj2dD1DFUYO5UTAmZ/7DBZnuE2RFeXlZq7oI6VUYG5Kk7z8EOUu0lITdfLCJwrHLXUXeiUj46iVdYb1Pt5+rGRvmhhVJd7B4Y3ypBbt5/0QdEXB0gzAwKt+sqlc0HV7EBqfH2/j9n4ZWF2o7kPTzu2asuuugH6otOhxOhfMBl26yaE5gVTZvCmq/dEwmzV/mrZ943HbEVzQF6zL2ZX/ZKnGz/Sv/5aUR1Xztp52GKFrf5K/XndWJyHwRcD+9ah3BRDkTN3dyN2EHh68anWIxem8ngTXi1fXFrO04pftbW1lfN4E16YC08rfgVBBh7SJZAgl3qeVnwKYkz2hNqjFL9/QRZaxEQeZE/SLJ5e/AmD88TYcwSNKPjV92gLbzI8zh4jzImnF3/qoYaf4enFnyC+ZHwLekJNfEEudfAjmacXv4Igx2LL0KNOQEHs9QB2AH7FU0oMQcAJdxMFo63wI/5bdVfC4CGJuK/t3OhUHnbiC5KJyzKDRgOJVz6CFSQ2BBKM6Y0Vro81GmNI3NIRjrBlAVEpN9zknt2aQxGYkArMQlPQoEjVbjD8ijdunOO5bnIggUE3Aqm8ReILkQ+Uo4mcOv5vBLctBnDfIUCcloqkpP8DqP5xqx7py9IAAAAASUVORK5CYII=",
                }}
              />

              <View style={styles.userDetails}>
                <Text style={styles.username}>{post.user.name}</Text>
              </View>
            </View>

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
                      name={post.likes?.includes(userId) ? "heart" : "hearto"}
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
    marginTop: 1,
  },
  icon: {
    marginRight: 0,
    marginLeft: 8,
  },
  interactionText: {
    marginTop: 5,
    color: "gray",
    fontSize: 12,
  },
});

export default HomeScreen;
