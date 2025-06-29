import { useNavigation } from "@react-navigation/native";
import { LeftArrowIcon, RightArrowIcon } from "assets/svgs/Svg";
import { BlurView } from "expo-blur";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import MaintButton from "src/Components/Shared/MaintButton";
import Title from "src/Components/Shared/Title";
import { useTranslation } from "src/Services/hooks/useTranslation";

const centersData = [
  {
    id: "1",
    location: "City Center",
    time: "10:30 - 17:00",
    visits: 5,
  },
  {
    id: "2",
    location: "North Clinic",
    time: "11:00 - 17:00",
    visits: 3,
  },
  {
    id: "3",
    location: "South Point",
    time: "09:15 - 17:00",
    visits: 7,
  },
  // Add more mock centers if needed
];

export default function CentersScreen() {
  const { translate, language: selectedLanguage } = useTranslation();
  const [searchText, setSearchText] = useState("");

  const filteredCenters = useMemo(() => {
    if (!searchText.trim()) return centersData;
    return centersData.filter((center) =>
      center.location.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);
  const navigation = useNavigation();

  return (
    <View
      style={{ backgroundColor: "white", flex: 1, paddingBottom: hp("10%") }}
    >
      <Title value={translate("Available centers")} />

      <TextInput
        placeholder={translate("Search by location")}
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        placeholderTextColor="#888"
      />

      <FlatList
        data={filteredCenters}
        numColumns={2}
        scrollEnabled
        contentContainerStyle={styles.flatList}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <BlurView intensity={10} tint="dark" style={styles.card}>
              <View style={{ width: "100%" }}>
                <Text style={styles.locationText}>{item.location}</Text>
                <Text style={styles.detailText}>
                  {translate("Available at")}: {item.time}
                </Text>
                <Text style={styles.detailText}>
                  {translate("Visits")}: {item.visits}
                </Text>
              </View>
              {selectedLanguage === "en" ? (
                <RightArrowIcon color="#000" />
              ) : (
                <LeftArrowIcon color="#000" />
              )}
            </BlurView>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {translate("No properties found")}
            </Text>
          </View>
        )}
        ListFooterComponentStyle={{ marginTop: hp("5%") }}
        ListFooterComponent={
          <MaintButton
            action={() => {
              navigation.navigate("NewCenterScreen");
            }}
            title={translate("Add center")}
            backgroundColor="black"
            textColor="white"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: "#f2f2f2",
    marginHorizontal: wp("5%"),
    borderRadius: 16,
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2.5%"),
    fontSize: wp("4%"),
    marginVertical: hp("1.5%"),
    color: "#000",
  },
  flatList: {
    paddingHorizontal: wp("5%"),
    paddingTop: hp("1%"),
  },
  cardWrapper: {
    flex: 1,
    padding: wp("1.5%"),
  },
  card: {
    padding: hp("2%"),
    borderRadius: 16,
    overflow: "hidden",
    height: hp("18%"),
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  locationText: {
    fontSize: wp("4.2%"),
    fontWeight: "bold",
    color: "#000",
    marginBottom: hp("0.5%"),
  },
  detailText: {
    fontSize: wp("3.8%"),
    color: "#333",
    marginTop: hp("0.3%"),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: hp("10%"),
  },
  emptyText: {
    fontSize: wp("4.5%"),
    fontFamily: "regular",
  },
});
