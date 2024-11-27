import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, Picker } from "react-native";
import ProductCard from "./components/productCard/index.jsx";

export default function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://dfef-dmrn-tps-default-rtdb.firebaseio.com/products.json"
      );
      const data = await response.json();
      const productList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setProducts(productList);
      setFilteredProducts(productList);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    const filtered = products.filter((product) =>
      product.nome.toLowerCase().includes(filterText.toLowerCase()) ||
      product.descricao.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    let sortedProducts = [...filteredProducts];
    
    if (order === "name-asc") {
      sortedProducts.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (order === "name-desc") {
      sortedProducts.sort((a, b) => b.nome.localeCompare(a.nome));
    } else if (order === "price-asc") {
      sortedProducts.sort((a, b) => a.preco - b.preco);
    } else if (order === "price-desc") {
      sortedProducts.sort((a, b) => b.preco - a.preco);
    }
    
    setFilteredProducts(sortedProducts);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Filtrar por nome ou descrição..."
          value={filterText}
          onChangeText={setFilterText}
        />
        <Button title="Filtrar" onPress={applyFilter} />
      </View>
      <View style={styles.sortContainer}>
        <Picker
          selectedValue={sortOrder}
          onValueChange={(itemValue) => handleSortChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Ordenar por Nome (Crescente)" value="name-asc" />
          <Picker.Item label="Ordenar por Nome (Decrescente)" value="name-desc" />
          <Picker.Item label="Ordenar por Preço (Crescente)" value="price-asc" />
          <Picker.Item label="Ordenar por Preço (Decrescente)" value="price-desc" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              nome={item.nome}
              descricao={item.descricao}
              preco={item.preco}
              imagem={item.imagens[0]}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  sortContainer: {
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
  },
});
