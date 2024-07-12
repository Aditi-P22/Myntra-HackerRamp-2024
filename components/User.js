import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  console.log("sds", item);
  const [requestSent, setRequestSent] = useState(false);
  const sendFollow = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://192.168.0.155:3000/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      const response = await fetch("http://192.168.0.155:3000/users/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loggedInUserId: userId,
          targetUserId: targetId,
        }),
      });

      if (response.ok) {
        setRequestSent(false);
        console.log("unfollowed successfully");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    // Reset the requestSent state whenever the userId or item prop changes
    setRequestSent(false);
  }, [userId, item]);
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "data:image/png;base64,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",
          }}
        />

        <Text style={{ fontSize: 15, fontWeight: "500", flex: 1 }}>
          {item?.name}
        </Text>

        {requestSent || item?.followers?.includes(userId) ? (
          <Pressable
            onPress={() => handleUnfollow(item?._id)}
            style={{
              borderColor: "#D0D0D0",
              borderWidth: 1,
              padding: 6,
              marginLeft: 10,
              width: 100,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 15,
                fontWeight: "bold",
                color: "#ff3e6c",
              }}
            >
              Following
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => sendFollow(userId, item._id)}
            style={{
              borderColor: "#D0D0D0",
              borderWidth: 1,
              padding: 6,
              marginLeft: 10,
              width: 100,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}
            >
              Follow
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});
