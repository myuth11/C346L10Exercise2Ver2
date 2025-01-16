import React, { useState, useEffect } from 'react';
import {
  FlatList,
  TextInput,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';

let originalData = [];
const CatBreedsApp = () => {
  const [catBreeds, setCatBreeds] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const coatColors = {
    Short: "#ADD8E6",
    Long: "#FFD700",
    "Short/Long": "#90EE90",
    "Semi-long": "#FFB6C1",
    Rex: "#D3D3D3",
    Default: "#F5F5F5",
  };

  const coatLogos = {
    Short: require('./assets/short-coat.png'),
    Long: require('./assets/long-coat.png'),
    "Short/Long": require('./assets/short-long-coat.png'),
    "Semi-long": require('./assets/semi-long-coat.png'),
    Rex: require('./assets/rex-coat.png'),
    Default: require('./assets/default-coat.png'),
  };

  useEffect(() => {
    fetch(
        "https://mysafeinfo.com/api/data?list=catbreeds&format=json&case=default"
    )
        .then((response) => response.json())
        .then((data) => {
          if (originalData.length < 1) {
            originalData = data;
            setCatBreeds(data);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filterCatBreeds = (text) => {
    if (text !== "") {
      const filtered = originalData.filter(
          (item) =>
              (item.BreedName &&
                  item.BreedName.toLowerCase().includes(text.toLowerCase())) ||
              (item.Origin &&
                  item.Origin.toLowerCase().includes(text.toLowerCase())) ||
              (item.OriginLocation &&
                  item.OriginLocation.toLowerCase().includes(text.toLowerCase())) ||
              (item.CoatType &&
                  item.CoatType.toLowerCase().includes(text.toLowerCase()))
      );
      setCatBreeds(filtered);
    } else {
      setCatBreeds(originalData);
    }
  };

  const sortBreeds = (option) => {
    setSortOption(option);
    const sortedData = [...catBreeds].sort((a, b) => {
      if (option === 'alphabetical') {
        return a.BreedName.localeCompare(b.BreedName);
      } else if (option === 'origin') {
        return a.Origin.localeCompare(b.Origin);
      } else if (option === 'coatType') {
        return a.CoatType.localeCompare(b.CoatType);
      }
      return 0;
    });
    setCatBreeds(sortedData);
  };

  const renderCatBreed = ({ item }) => {
    const coatType = item.CoatType?.trim();
    const cardBackgroundColor =
        coatColors[coatType] || coatColors.Default;
    const coatLogo = coatLogos[coatType] || coatLogos.Default;

    return (
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.name}>Breed: {item.BreedName}</Text>
              <Text style={styles.info}>Origin: {item.Origin}</Text>
              <Text style={styles.info}>Origin Location: {item.OriginLocation}</Text>
              <Text style={styles.info}>Coat Type: {item.CoatType}</Text>
            </View>
            <Image source={coatLogo} style={styles.coatLogo} />
          </View>
        </View>
    );
  };

  return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Image
            source={require('./assets/cat-logo.png')}
            style={styles.logo}
            resizeMode="contain"
        />
        <Text style={styles.title}>Cat Breeds</Text>
        <TextInput
            style={styles.searchBox}
            placeholder="Search by breed, origin, or coat type..."
            onChangeText={(text) => filterCatBreeds(text)}
        />
        <View style={styles.sortOptions}>
          <TouchableOpacity
              onPress={() => sortBreeds('alphabetical')}
              style={[
                styles.sortButton,
                sortOption === 'alphabetical' && styles.activeSort,
              ]}
          >
            <Text style={styles.sortText}>Sort Alphabetically</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => sortBreeds('origin')}
              style={[
                styles.sortButton,
                sortOption === 'origin' && styles.activeSort,
              ]}
          >
            <Text style={styles.sortText}>Sort by Origin</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => sortBreeds('coatType')}
              style={[
                styles.sortButton,
                sortOption === 'coatType' && styles.activeSort,
              ]}
          >
            <Text style={styles.sortText}>Sort by Coat Type</Text>
          </TouchableOpacity>
        </View>
        <FlatList
            data={catBreeds}
            renderItem={renderCatBreed}
            keyExtractor={(item, index) => index.toString()}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  logo: {
    width: "100%",
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#FF4500",
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  sortOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sortButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#FF4500",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeSort: {
    backgroundColor: "#FFA07A",
  },
  sortText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coatLogo: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  info: {
    fontSize: 14,
    color: "#666",
  },
});

export default CatBreedsApp;
