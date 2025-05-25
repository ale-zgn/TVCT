import { View, Text, ScrollView, StyleSheet, StatusBar, FlatList, Image, Pressable, ActivityIndicator } from "react-native"
import React, { useEffect, useState } from "react"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import useTab from "../../Components/Shared/useTab"
import { HeartIcon2, HomeIcon } from "../../../assets/svgs/Svg"
import Property from "../../Components/Shared/Property"
import useFilter from "../../Components/Shared/useFilter"

import { useGetPropertiesQuery, useGetUserMeQuery } from "../../Services/API"
import { useGetUserPropertiesQuery } from "../../Services/API"

import { PropertyDataInterface } from "../../Interfaces/API"
import { useTranslation } from "../../Services/hooks/useTranslation"
import { CustomCalloutView } from "../Search/SearchScreen"
import { Acf, WPProperty } from "../../Interfaces/APIWP"
import { carsData } from "../Home/HomeScreen"

export default function MyPropertiesScreen() {
    const { translate, language } = useTranslation()
    const { data: properties, isLoading: propertiesIsLoading, isFetching: propretiesIsFetching, refetch: propretiesRefetch } = useGetUserPropertiesQuery({})
    const { data: wpproperties, refetch: wppropertiesRefetch } = useGetPropertiesQuery(language)
    const [favoriteProperties, setFavoriteProperties] = useState<WPProperty[]>()
    const { data: user, isFetching: fetchingUser } = useGetUserMeQuery({})

    useEffect(() => {
        wppropertiesRefetch()
        if (!fetchingUser && user && user.favorite_properties && wpproperties && wpproperties.length > 0 && user.favorite_properties.length > 0) {
            const filteredProperties = wpproperties.filter((property) => user.favorite_properties.includes(property.acf.project_name))
            const sortedProperties = filteredProperties.sort((a, b) => b.menu_order - a.menu_order)
            setFavoriteProperties(sortedProperties)
        } else {
            setFavoriteProperties([])
        }
    }, [language, user])

    // const { data: wpproperties = [] } = useGetPropertiesQuery("en")
    const { Tab, tabValue } = useTab({
        tabs: [
            {
                title: "My Properties",
                icon: (color: string) => <HomeIcon color={color} />,
            },
            {
                title: "Favorites",
                icon: (color: string) => <HeartIcon2 color={color} />,
            },
        ],
    })

    const { Filter, selectedFilter } = useFilter({
        title: translate("Properties "),
        //@ts-ignore
        // data: properties?.map((item) => ({ label: item.name, value: item.name })),
        data: ["zzz", "zzzz"],
    })

    // const filteredProperties = React.useMemo(() => {
    //     if (!selectedFilter) return properties
    //     return properties?.filter((item) => item.name.includes(selectedFilter))
    // }, [selectedFilter])

    return (
        <>
            <View style={styles.wrapper}>
                <StatusBar backgroundColor="#fcfcfc" barStyle="dark-content" />
                <ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: "center" }}>
                    <Filter />
                    {tabValue === 0 && (
                        <FlatList
                            contentContainerStyle={styles.flatList}
                            showsHorizontalScrollIndicator={false}
                            data={carsData}
                            renderItem={({ item }) => <Property property={item} />}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            ListEmptyComponent={() => (
                                <View style={{ alignItems: "center", height: hp("50%"), justifyContent: "center", flex: 1 }}>
                                    <Text style={{ fontFamily: "medium", fontSize: wp("5%"), color: "#000" }}>{translate("No properties found")}</Text>
                                </View>
                            )}
                        />
                    )}
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: wp("6%"),
        fontFamily: "bold",
        color: "#000",
        marginTop: hp("1%"),
        marginLeft: wp("5%"),
        marginBottom: hp("2.5%"),
    },
    wrapper: {
        flex: 1,
        backgroundColor: "#fcfcfc",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp("7%"),
    },
    scrollView: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: wp("90%"),
        marginVertical: hp("2.5%"),
        marginBottom: hp("0.5%"),
    },
    filterContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        backgroundColor: "#EDEDED",
    },
    filterText: {
        marginRight: 5,
    },
    separator: {
        height: hp("2%"),
    },
    flatList: {
        paddingHorizontal: wp("5%"),
        paddingBottom: hp("5%"),
    },
    container: {
        flex: 1,
        justifyContent: "center",
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
})
