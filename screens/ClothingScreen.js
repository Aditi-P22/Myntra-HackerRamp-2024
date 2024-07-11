import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const ClothingScreen = () => {
  const [category, setCategory] = useState("tops");

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={[styles.navButton, category === "tops" && styles.activeButton]}
          onPress={() => setCategory("tops")}
        >
          <Text style={styles.navText}>Tops</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            category === "bottoms" && styles.activeButton,
          ]}
          onPress={() => setCategory("bottoms")}
        >
          <Text style={styles.navText}>Bottoms</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            category === "footwear" && styles.activeButton,
          ]}
          onPress={() => setCategory("footwear")}
        >
          <Text style={styles.navText}>Footwear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            category === "accessories" && styles.activeButton,
          ]}
          onPress={() => setCategory("accessories")}
        >
          <Text style={styles.navText}>Accessories</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginTop: 10, backgroundColor: "white" }}>
        {category === "tops" && <TopsScreen />}
        {category === "bottoms" && <BottomsScreen />}
        {category === "footwear" && <FootwearScreen />}
        {category === "accessories" && <AccessoriesScreen />}
      </ScrollView>
    </View>
  );
};

const TopsScreen = () => {
  const [tops, setTops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTops();
  }, []);

  const fetchTops = async () => {
    try {
      const response = await axios.get("http://192.168.29.11:3000/tops");
      setTops(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching tops", error);
      setError(error);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error fetching tops: {error.message}</Text>
      </View>
    );
  }

  return (
    <View>
      {tops.map((top, index) => (
        <View key={index} style={styles.itemContainer}>
          <Image style={styles.image} source={{ uri: top.image }} />
          <Text style={styles.name}>{top.name}</Text>
          <Text style={styles.details}>
            Brand: {top.brand} | Price: ${top.price} | Color: {top.color}
          </Text>
        </View>
      ))}
    </View>
  );
};

const BottomsScreen = () => {
  const [bottoms, setBottoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBottoms();
  }, []);

  const fetchBottoms = async () => {
    try {
      const response = await axios.get("http://192.168.29.11:3000/bottoms");
      setBottoms(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching bottoms", error);
      setError(error);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error fetching bottoms: {error.message}</Text>
      </View>
    );
  }

  return (
    <View>
      {bottoms.map((bottom, index) => (
        <View key={index} style={styles.itemContainer}>
          <Image style={styles.image} source={{ uri: bottom.image }} />
          <Text style={styles.name}>{bottom.name}</Text>
          <Text style={styles.details}>
            Brand: {bottom.brand} | Price: ${bottom.price} | Color:{" "}
            {bottom.color}
          </Text>
        </View>
      ))}
    </View>
  );
};

const FootwearScreen = () => {
  const [footwear, setFootwear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFootwear();
  }, []);

  const fetchFootwear = async () => {
    try {
      const response = await axios.get("http://192.168.29.11:3000/footwear");
      setFootwear(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching footwear", error);
      setError(error);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error fetching footwear: {error.message}</Text>
      </View>
    );
  }

  return (
    <View>
      {footwear.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Image style={styles.image} source={{ uri: item.image }} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>
            Brand: {item.brand} | Price: ${item.price} | Color: {item.color}
          </Text>
        </View>
      ))}
    </View>
  );
};

const AccessoriesScreen = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const response = await axios.get("http://192.168.29.11:3000/accessories");
      setAccessories(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching accessories", error);
      setError(error);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error fetching accessories: {error.message}</Text>
      </View>
    );
  }

  return (
    <View>
      {accessories.map((accessory, index) => (
        <View key={index} style={styles.itemContainer}>
          <Image style={styles.image} source={{ uri: accessory.image }} />
          <Text style={styles.name}>{accessory.name}</Text>
          <Text style={styles.details}>
            Brand: {accessory.brand} | Price: ${accessory.price} | Color:{" "}
            {accessory.color}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  navButton: {
    paddingVertical: 5,
  },
  navText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  itemContainer: {
    padding: 15,
    borderColor: "#D0D0D0",
    borderTopWidth: 1,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    color: "gray",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ClothingScreen;
