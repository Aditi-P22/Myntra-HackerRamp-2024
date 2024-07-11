import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { UserType } from "../UserContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const ThreadsScreen = ({ route }) => {
  const { userId, setUserId } = useContext(UserType);
  const { selectedProducts } = route.params;
  const [content, setContent] = useState("");

  const handlePostSubmit = () => {
    const postData = {
      userId,
      products: selectedProducts,
    };

    if (content) {
      postData.content = content;
    }

    axios
      .post("http://192.168.29.11:3000/create-post", postData)
      .then((response) => {
        setContent("");
        // Add any additional logic if needed
      })
      .catch((error) => {
        console.log("error creating post", error);
      });
  };

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text>Sujan_Music</Text>
      </View>

      <ScrollView style={{ marginVertical: 10 }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          {selectedProducts.map((product, index) => (
            <View key={index} style={styles.productCard}>
              <Image style={styles.image} source={{ uri: product.image }} />
              <Text style={styles.price}>{`₹${product.price}`}</Text>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.brand}>{product.brand}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <TextInput
        value={content}
        onChangeText={(text) => setContent(text)}
        placeholderTextColor={"black"}
        placeholder="Type your message..."
        multiline
        style={styles.textInput}
      />

      <Button onPress={handlePostSubmit} title="Share Post" />
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({
  productCard: {
    width: "45%",
    backgroundColor: "#f8f8f8",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  brand: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  textInput: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
