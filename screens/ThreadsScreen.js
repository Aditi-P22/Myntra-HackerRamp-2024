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
  const { userId } = useContext(UserType);
  const { selectedProducts } = route.params;
  const [content, setContent] = useState("");
  const [outfitName, setOutfitName] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");

  const handlePostSubmit = () => {
    const postData = {
      userId,
      products: selectedProducts,
      outfitName,
      tags: tags.split(",").map((tag) => tag.trim()), // assuming tags are comma-separated
      description,
      content,
    };

    axios
      .post("http://192.168.29.11:3000/create-post", postData)
      .then((response) => {
        setContent("");
        setOutfitName("");
        setTags("");
        setDescription("");
        // Add any additional logic if needed
      })
      .catch((error) => {
        console.log("Error creating post", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <Text style={styles.username}>Sujan_Music</Text>
        </View>

        <View style={styles.productContainer}>
          {selectedProducts.map((product, index) => (
            <View key={index} style={styles.productCard}>
              <Image style={styles.image} source={{ uri: product.image }} />
              <Text style={styles.price}>{`₹${product.price}`}</Text>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.brand}>{product.brand}</Text>
            </View>
          ))}
        </View>

        <TextInput
          value={outfitName}
          onChangeText={(text) => setOutfitName(text)}
          placeholder="Outfit Name"
          placeholderTextColor={"black"}
          style={styles.textInput}
          multiline={true}
          numberOfLines={3} // Adjust as needed
        />

        <TextInput
          value={tags}
          onChangeText={(text) => setTags(text)}
          placeholder="Tags (comma separated)"
          placeholderTextColor={"black"}
          style={styles.textInput}
          multiline={true}
          numberOfLines={3} // Adjust as needed
        />

        <TextInput
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder="Description"
          placeholderTextColor={"black"}
          style={styles.textInput}
          multiline={true}
          numberOfLines={5} // Adjust as needed
        />

        <Button onPress={handlePostSubmit} title="Share Post" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  username: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
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
    minHeight: 50, // Ensure TextInput has enough height to display multiline content
  },
});
