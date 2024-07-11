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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ClothingScreen = () => {
  const [category, setCategory] = useState("tops");
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedFootwear, setSelectedFootwear] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const navigation = useNavigation();

  const toggleSelectProduct = (product, type) => {
    switch (type) {
      case "top":
        setSelectedTop(product);
        break;
      case "bottom":
        setSelectedBottom(product);
        break;
      case "footwear":
        setSelectedFootwear(product);
        break;
      case "accessory":
        setSelectedAccessory(product);
        break;
      default:
        break;
    }
  };

  const getSelectedProducts = () => {
    const selectedProducts = [];
    if (selectedTop) selectedProducts.push(selectedTop);
    if (selectedBottom) selectedProducts.push(selectedBottom);
    if (selectedFootwear) selectedProducts.push(selectedFootwear);
    if (selectedAccessory) selectedProducts.push(selectedAccessory);
    return selectedProducts;
  };

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
        {category === "tops" && (
          <TopsScreen
            toggleSelectProduct={(product) =>
              toggleSelectProduct(product, "top")
            }
            selectedProduct={selectedTop}
          />
        )}
        {category === "bottoms" && (
          <BottomsScreen
            toggleSelectProduct={(product) =>
              toggleSelectProduct(product, "bottom")
            }
            selectedProduct={selectedBottom}
          />
        )}
        {category === "footwear" && (
          <FootwearScreen
            toggleSelectProduct={(product) =>
              toggleSelectProduct(product, "footwear")
            }
            selectedProduct={selectedFootwear}
          />
        )}
        {category === "accessories" && (
          <AccessoriesScreen
            toggleSelectProduct={(product) =>
              toggleSelectProduct(product, "accessory")
            }
            selectedProduct={selectedAccessory}
          />
        )}
      </ScrollView>

      <View style={styles.selectedProductsContainer}>
        <Text style={styles.selectedProductsText}>
          {getSelectedProducts().length} Products • ₹
          {getSelectedProducts()
            .reduce((total, product) => total + product.price, 0)
            .toFixed(2)}
        </Text>
        <ScrollView horizontal>
          {getSelectedProducts().map((product, index) => (
            <View key={index} style={styles.selectedProductCard}>
              <Image style={styles.image} source={{ uri: product.image }} />
              <TouchableOpacity
                style={styles.minusIcon}
                onPress={() => toggleSelectProduct(null, product.type)}
              >
                <Ionicons name="remove-circle" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("ThreadsScreen", {
            selectedProducts: getSelectedProducts(),
          })
        }
      >
        <Text style={styles.buttonText}>NEXT: NAME YOUR CURATION</Text>
      </TouchableOpacity>
    </View>
  );
};
const TopsScreen = ({ toggleSelectProduct, selectedProduct }) => {
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
    <View style={styles.productsContainer}>
      {tops.map((top, index) => (
        <View key={index} style={styles.productCard}>
          <Image style={styles.image} source={{ uri: top.image }} />
          <Text style={styles.price}>{`₹${top.price}`}</Text>
          <Text style={styles.name}>{top.name}</Text>
          <Text style={styles.brand}>{top.brand}</Text>
          <TouchableOpacity
            style={styles.plusIcon}
            onPress={() => toggleSelectProduct(top)}
          >
            <Ionicons
              name={
                selectedProduct && selectedProduct.id === top.id
                  ? "remove-circle"
                  : "add-circle"
              }
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const BottomsScreen = ({ toggleSelectProduct, selectedProduct }) => {
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
    <View style={styles.productsContainer}>
      {bottoms.map((bottom, index) => (
        <View key={index} style={styles.productCard}>
          <Image style={styles.image} source={{ uri: bottom.image }} />
          <Text style={styles.price}>{`₹${bottom.price}`}</Text>
          <Text style={styles.name}>{bottom.name}</Text>
          <Text style={styles.brand}>{bottom.brand}</Text>
          <TouchableOpacity
            style={styles.plusIcon}
            onPress={() => toggleSelectProduct(bottom)}
          >
            <Ionicons
              name={
                selectedProduct && selectedProduct.id === bottom.id
                  ? "remove-circle"
                  : "add-circle"
              }
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const FootwearScreen = ({ toggleSelectProduct, selectedProduct }) => {
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
    <View style={styles.productsContainer}>
      {footwear.map((item, index) => (
        <View key={index} style={styles.productCard}>
          <Image style={styles.image} source={{ uri: item.image }} />
          <Text style={styles.price}>{`₹${item.price}`}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.brand}>{item.brand}</Text>
          <TouchableOpacity
            style={styles.plusIcon}
            onPress={() => toggleSelectProduct(item)}
          >
            <Ionicons
              name={
                selectedProduct && selectedProduct.id === item.id
                  ? "remove-circle"
                  : "add-circle"
              }
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const AccessoriesScreen = ({ toggleSelectProduct, selectedProduct }) => {
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
    <View style={styles.productsContainer}>
      {accessories.map((accessory, index) => (
        <View key={index} style={styles.productCard}>
          <Image style={styles.image} source={{ uri: accessory.image }} />
          <Text style={styles.price}>{`₹${accessory.price}`}</Text>
          <Text style={styles.name}>{accessory.name}</Text>
          <Text style={styles.brand}>{accessory.brand}</Text>
          <TouchableOpacity
            style={styles.plusIcon}
            onPress={() => toggleSelectProduct(accessory)}
          >
            <Ionicons
              name={
                selectedProduct && selectedProduct.id === accessory.id
                  ? "remove-circle"
                  : "add-circle"
              }
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  navButton: {
    padding: 10,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  navText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productsContainer: {
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
  plusIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  selectedProductsContainer: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  selectedProductsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedProductCard: {
    width: 100,
    height: 100,
    marginRight: 10,
    position: "relative",
  },
  minusIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ClothingScreen;
