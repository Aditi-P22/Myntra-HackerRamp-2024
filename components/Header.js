// components/Header.js
import React from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const Header = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity>
        <Image
          style={styles.logo}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJaZFxwPVRLp4lnm6GtAt154e86wb-5A9QSA&s",
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.localImage}
          source={require("../assets/become a insider.png")} // Update this path
        />
      </TouchableOpacity>
      {/* <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={10}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search products and brands"
          />
        </View> */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.icon}>
          <Image
            style={[
              styles.localImage,
              { width: 33, height: 33, marginLeft: -2, marginBottom: 6 },
            ]}
            source={require("../assets/super_coin_myntra.png")} // Update this path
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <AntDesign name="hearto" size={22} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="bag-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    // marginTop: 23,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 3,
    position: "absolute", // Fix the header at the top
    top: 8,
    width: "100%", // Ensure it spans the full width
    zIndex: 1000, // Ensure it's on top of other content
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginBottom: -20,
  },
  localImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginLeft: 10, // Add margin to separate the images
    marginBottom: -20,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 106,
    marginBottom: -20,
  },
  icon: {
    marginLeft: 10,
  },
});

export default Header;
