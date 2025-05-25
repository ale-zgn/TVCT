import React, { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, Pressable, ActivityIndicator, SafeAreaView } from "react-native"
import MapView, { Marker, Callout } from "react-native-maps"
import {
    FilterIcon,
    HeartIcon,
    ListSort1Icon,
    ListSort2Icon,
    ListSort3Icon,
    MapIcon,
    MarkerIcon,
    RightArrowIcon,
    TypeIcon,
    TypesIcon,
    UnitIcon,
    LeftArrowIcon,
    BookMarkpressed,
    BookMark,
} from "../../../assets/svgs/Svg"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import useSearchBar from "../../Components/Shared/useSearchBar"
import useTab from "../../Components/Shared/useTab"
import { FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { HomeDetails } from "../../Components/Shared/HomeDetails"
import { useGetPropertiesQuery, useGetUserMeQuery, useUpdateFavoritePropertiesMutation } from "../../Services/API"
import { useTranslation } from "../../Services/hooks/useTranslation"
import { useAppProvider } from "../../Services/hooks/AppProvider"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { BlurView } from "expo-blur"
import * as SecureStore from "expo-secure-store"
import { WPProperty } from "../../Interfaces/APIWP"

import CachedImage from "expo-cached-image"
import { stringMd5 } from "react-native-quick-md5"

import { Image } from "react-native-expo-image-cache"

export default function SearchScreen() {
    const navigation = useNavigation()
    const { filters } = useAppProvider()
    const [filteredProperties, setFilteredProperties] = useState<WPProperty[]>([])
    const [propertyDisplay, setPropertyDisplay] = React.useState(true)

    const mapRef = useRef<MapView>(null)
    const { translate, language: selectedLanguage } = useTranslation()

    const { data: properties, isFetching: fetchingPropreties, isLoading } = useGetPropertiesQuery(selectedLanguage)

    const { searchBar, value: searchBarText } = useSearchBar({
        placeholder: "Search a property",
        withPadding: false,
    })

    const { Tab, tabValue } = useTab({
        tabs: [
            {
                title: translate("List view"),
                icon: (color: string) => <ListSort1Icon color={color} />,
            },
            {
                title: translate("Map view"),
                icon: (color: string) => <MapIcon color={color} />,
            },
        ],
    })

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: 35.8256,
                    longitude: 10.6084,
                    latitudeDelta: 0.2044,
                    longitudeDelta: 0.0842,
                },
                900,
            )
        }
    }, [mapRef])

    useEffect(() => {
        if (filters !== null && properties && !fetchingPropreties) {
            const sortedProperties = properties
                .filter((property: WPProperty) => {
                    let valid = true

                    if (filters?.type?.length !== 0 && filters?.type?.some((item) => property?.type_properties[0]?.includes(item)) == false) {
                        valid = false
                    }

                    if (filters?.status?.length !== 0) {
                        //@ts-ignore
                        const isValid = filters.status.some((status) => property.acf[status] === "1")
                        if (!isValid) {
                            valid = false
                        }
                    }

                    if (filters?.cities?.length !== 0 && filters.cities.some((item) => property?.city_properties?.includes(item)) == false) {
                        valid = false
                    }

                    if (property?.acf.project_name === "Ewan Sedra 3" || property?.acf.project_name === "Ewan Sedra 4") {
                        valid = false
                    }

                    /* if (
                        filters?.plotArea?.length !== 0 &&
                        property?.acf.land_area &&
                        !(parseFloat(property.acf.land_area) > filters.plotArea[0] && parseFloat(property.acf.land_area) < filters.plotArea[1])
                    ) {
                        if (!isNaN(filters.plotArea[0]) && !isNaN(filters.plotArea[1])) {
                            valid = false
                        }
                    } */

                    if (searchBarText && !property?.title.rendered?.toLowerCase().includes(searchBarText.toLowerCase())) {
                        valid = false
                    }

                    return valid
                })
                .sort((a, b) => {
                    return a.menu_order - b.menu_order
                })
            setFilteredProperties(sortedProperties)
        } else {
            setFilteredProperties(properties || [])
        }
    }, [filters, properties, searchBarText])

    useEffect(() => {
        if (tabValue === 1) {
            setPropertyDisplay(true)
        } else {
            setPropertyDisplay(false)
        }
    }, [tabValue])

    return (
        <View style={styles.container}>
            <View>
                <MapView
                    style={styles.map}
                    ref={mapRef}
                    initialRegion={{
                        latitude: 35.8256,
                        longitude: 10.6084,
                        latitudeDelta: 0.2044,
                        longitudeDelta: 0.0842,
                    }}
                    showsUserLocation={true}
                >
                    {/* {filteredProperties
                        .filter((property) => property.acf.location)
                        .map((property) => {
                            return (
                                <Marker
                                    key={property.id}
                                    coordinate={{
                                        latitude: property?.acf?.location.lat,
                                        longitude: property?.acf?.location.lng,
                                    }}
                                    title={property.acf.project_name}
                                >
                                    <CustomMarkerView property={property} />

                                    <Callout
                                        onPress={() => {
                                            if (property.acf.coming_soon === "1") {
                                                // @ts-ignore
                                                navigation.navigate("FavoritProperty2", { property_api: property })
                                            } else {
                                                //@ts-ignore
                                                navigation.navigate("SearchPropertyDetails", {
                                                    property_api: property,
                                                })
                                            }
                                        }}
                                        tooltip={true}
                                    >
                                        <CustomCalloutView property={property} selectedSort={propertyDisplay} />
                                    </Callout>
                                </Marker>
                            )
                        })} */}
                </MapView>
            </View>
        </View>
    )
}

const CustomMarkerView = ({ property }: { property: WPProperty }) => {
    return (
        <View style={[styles.marker, { backgroundColor: property.acf.sold_out === "1" ? "black" : "white" }]}>
            <Text style={[styles.markerText, { color: property.acf.sold_out === "1" ? "white" : "black" }]}>{property.title.rendered}</Text>
            <View style={[styles.rectangle, { backgroundColor: property.acf.sold_out === "1" ? "black" : "white" }]} />
        </View>
    )
}

export const CustomCalloutView = ({ property, selectedSort, pagestatus = false }: { property: WPProperty; selectedSort: boolean; pagestatus?: boolean }) => {
    const navigation = useNavigation()
    const { translate, language } = useTranslation()
    const [isAuth, setIsAuth] = useState(false)
    const { data: user, isFetching: userFetching, refetch: userRefetch } = useGetUserMeQuery({})
    const [updateFavoriteProperties, updateFavoritePropertyMutation] = useUpdateFavoritePropertiesMutation()

    useEffect(() => {
        SecureStore.getItemAsync("token").then((token) => {
            if (token) {
                setIsAuth(true)
            } else {
                setIsAuth(false)
            }
        })
    }, [])

    return (
        <Pressable
            onPress={() => {
                if (property.acf.coming_soon === "1") {
                    // @ts-ignore
                    navigation.navigate("FavoritProperty2", { property_api: property })
                } else {
                    //@ts-ignore
                    navigation.navigate("SearchPropertyDetails", {
                        property_api: property,
                    })
                }
            }}
            style={[
                styles.calloutContainer,
                {
                    // backgroundColor: "blue",
                    width: pagestatus ? wp("90%") : selectedSort ? wp("70%") : wp("47%"),
                    marginHorizontal: selectedSort ? wp("0%") : wp("1%"),
                },
            ]}
        >
            <CachedImage
                cacheKey={stringMd5(property._embedded["wp:featuredmedia"][0].link || "")}
                source={{ uri: property._embedded["wp:featuredmedia"][0].link }}
                style={{
                    width: pagestatus ? wp("90%") : "100%",
                    height: wp("40%"),
                }}
            />

            {property.acf.available_project != "1" && (
                <View
                    style={[
                        styles.statusWrapper,
                        {
                            backgroundColor: property.acf.sold_out === "1" ? "#ffffff" : "#ffffff",
                        },
                    ]}
                >
                    <Text
                        style={[
                            {
                                fontSize: wp("3.5%"),
                                fontFamily: "medium",
                                textAlign: "center",
                                color: property.acf.sold_out === "1" ? "#000000" : "#000000",
                            },
                        ]}
                    >
                        {property.acf.sold_out === "1" ? translate("Sold out") : translate("Coming Soon")}
                    </Text>
                </View>
            )}

            <BlurView intensity={80} style={[styles.heartWrapper, { backgroundColor: "#ffffff20" }]}>
                <Pressable
                    onPress={async () => {
                        if (!isAuth) {
                            //@ts-ignore
                            navigation.navigate("FavoritProperty", {
                                property_api: property,
                            })
                        } else {
                            const response = await updateFavoriteProperties({ project_name: property.acf.project_name }).unwrap()
                            if (response) {
                                if (response.includes(property.acf.project_name)) {
                                    Toast.show({
                                        type: ALERT_TYPE.SUCCESS,

                                        textBody: translate("{title} saved to favorites", { title: property.title.rendered }),
                                    })
                                } else {
                                    Toast.show({
                                        type: ALERT_TYPE.SUCCESS,

                                        textBody: translate("{title} removed from favorites", { title: property.title.rendered }),
                                    })
                                }
                                userRefetch()
                            }
                        }
                    }}
                    hitSlop={{
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20,
                    }}
                >
                    {updateFavoritePropertyMutation.isLoading ? (
                        <ActivityIndicator size={14} />
                    ) : user?.favorite_properties?.includes(property.acf.project_name) ? (
                        <BookMarkpressed />
                    ) : (
                        <BookMark color="#ffffff20" />
                    )}
                </Pressable>
            </BlurView>

            <View style={styles.calloutTitleContainer}>
                <MarkerIcon />
                <Text style={styles.calloutTitle}>{property.city_properties[0]}</Text>
            </View>

            <Text style={[styles.calloutDescription, { fontSize: selectedSort ? wp("6%") : wp("4.25%") }, { textAlign: "left" }]}>{property.title.rendered}</Text>

            <View
                style={[
                    {
                        marginVertical: selectedSort ? hp("2%") : hp("1.5%"),
                        marginHorizontal: selectedSort ? wp("5%") : wp("2.5%"),
                        flexDirection: "row",
                        justifyContent: "space-between",
                    },
                ]}
            >
                <HomeDetails icon={<TypeIcon />} name={translate("Type ")} value={property.type_properties} swidth={selectedSort ? "33%" : "50%"} selectedSort={selectedSort} />

                {property.acf.units !== "" && (
                    <HomeDetails icon={<UnitIcon />} name={translate("Units")} value={property.acf.units} swidth={selectedSort ? "33%" : "50%"} selectedSort={selectedSort} />
                )}
                {/* {selectedSort && (
                    <HomeDetails
                        icon={<TypesIcon />}
                        name={translate("Types")}
                        value={property.acf.project_type.length}
                        swidth={selectedSort ? "33%" : "50%"}
                        selectedSort={selectedSort}
                    />
                )} */}
            </View>
            <View style={styles.calloutSeparator} />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "90%",
                    alignSelf: "center",
                    paddingVertical: hp("1.75%"),
                }}
            >
                <Text style={[styles.details, selectedSort ? { fontSize: wp("5%") } : { fontSize: wp("4%") }]}>{translate("View details")}</Text>
                {language == "ar" ? <LeftArrowIcon /> : <RightArrowIcon />}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fcfcfc",
    },
    map: {
        width: "100%",
        height: "100%",
    },

    mapFilterWrapper: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#EDEDED",
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("1%"),
    },

    marker: {
        padding: 5,
        borderRadius: 5,
        paddingHorizontal: wp("2%"),
        paddingVertical: hp("0.5%"),
        height: hp("5%"),
        alignItems: "center",
        justifyContent: "center",
    },
    markerText: {
        fontFamily: "bold",
        fontSize: wp("3.75%"),
    },
    rectangle: {
        width: wp("2.5%"),
        height: wp("2.5%"),
        transform: [{ rotate: "45deg" }],
        position: "absolute",
        alignSelf: "center",
        top: hp("4.5%"),
        borderRadius: 3,
    },
    calloutContainer: {
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    calloutImage: {
        width: "100%",
    },
    calloutTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        marginTop: hp("1.5%"),
    },
    calloutTitle: {
        color: "#666666",
        fontSize: wp("4%"),
        fontFamily: "medium",
        marginLeft: 5,
    },
    calloutDescription: {
        fontFamily: "regular",
        width: "90%",
        alignSelf: "center",
        marginTop: 5,
    },
    calloutSeparator: {
        width: "90%",
        height: 1,
        backgroundColor: "black",
        alignSelf: "center",
        opacity: 0.05,
    },
    markerIcon: {
        width: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: "#85563a57",
        borderColor: "#85563aa0",
    },
    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: wp("90%"),
        alignSelf: "center",
        marginTop: hp("1%"),
        paddingBottom: hp("1%"),
        // marginBottom: hp("1%"),
    },
    sortContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    sortIcon: {
        marginRight: wp("2%"),
    },
    sortTitleText: {
        fontSize: wp("5%"),
        fontFamily: "medium",
    },
    separator: {
        height: 10,
    },

    filterWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        zIndex: 2,
        backgroundColor: "#EDEDED",
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("1%"),
    },

    filterText: {
        fontSize: wp("4.25%"),
        fontFamily: "medium",
        marginLeft: 10,
    },
    details: {
        color: "#85553A",
        fontFamily: "regular",
        fontSize: wp("4.75%"),
    },
    indicator: {
        marginTop: hp("25%"),
    },

    emptyContainer: {
        width: wp("100%"),
        marginTop: 50,
    },
    emptyText: {
        fontFamily: "regular",
        fontSize: wp("4.5%"),
        color: "#888", // You can customize the color
        textAlign: "center",
        marginTop: hp("20%"),
    },

    heartWrapper: {
        position: "absolute",
        top: hp("1.4%"),
        right: wp("2.5%"),
        padding: 10,
        borderRadius: 50,
        overflow: "hidden",
    },
    statusWrapper: {
        position: "absolute",
        width: wp("18%"),
        height: wp("5.5%"),
        top: hp("1.7%"),
        left: wp("2.5%"),
        // backgroundColor: "#ffffff",
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
    },
    status: {
        fontSize: wp("1.5%"),
        fontFamily: "medium",
        // color: "#000000",
        textAlign: "center",
    },
})
