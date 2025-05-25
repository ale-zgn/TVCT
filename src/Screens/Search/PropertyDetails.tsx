import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, ScrollView, Share, SafeAreaView, ActivityIndicator, Platform } from "react-native"
import React, { useEffect, useState } from "react"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import {
    ShareIcon,
    TypeIcon,
    UnitIcon,
    ArrowLeftIcon,
    TypesIcon,
    BedRoomIcon,
    HomeIcon,
    LocationIcon,
    MapIcon,
    DownloadIcon,
    MenuIcon,
    MenuCloseIcon,
    BookMark,
    BookMarkpressed,
    CloseIcon,
    PropertyDetailsIcon,
    BuiltUpAreaIcon,
    PlotAreaIcon,
    RightArrowIcon,
} from "../../../assets/svgs/Svg"
import Carousel from "../../Components/Shared/carousel"
import { useNavigation, useRoute } from "@react-navigation/native"
import { HomeDetails } from "../../Components/Shared/HomeDetails"
import useTab from "../../Components/Shared/useTab"
import MaintButton from "../../Components/Shared/MaintButton"
import { useTranslation } from "../../Services/hooks/useTranslation"
import { useGetUserMeQuery, useUpdateFavoritePropertiesMutation, useRegisterPropertyInterestMutation } from "../../Services/API"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { LinearGradient } from "expo-linear-gradient"
import { useRef } from "react"
import Animated, { useSharedValue, useDerivedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"
import * as SecureStore from "expo-secure-store"
import MapView, { Marker } from "react-native-maps"
import { WPProperty } from "../../Interfaces/APIWP"
import ImageViewer from "react-native-image-zoom-viewer"
import * as OpenAnything from "react-native-openanything"

import ImageView from "react-native-image-viewing"

const CustomMarkerView = ({ property }: { property: WPProperty }) => {
    return (
        <View style={styles.marker}>
            <Text style={styles.markerText}>{property.title.rendered}</Text>
            <View style={styles.rectangle} />
        </View>
    )
}

export function removeHtmlTagsAndTrim(input: string) {
    const regex = /<[^>]*>/g
    const withoutTags = input.replace(regex, "")
    const trimmed = withoutTags.trim()
    return trimmed
}

export default function PropertyDetails() {
    const [iconsRender, setIconsRender] = useState(true)
    const [isAuth, setIsAuth] = useState(false)
    const route = useRoute()
    const { property_api, showVideo } = route.params as { property_api: WPProperty; showVideo?: boolean }
    const [currentImage, setCurrentImage] = useState("")
    const [isModalVisible, setModalVisible] = useState(false)
    const [registerPropertyInterest, registerPropertyInterestMutation] = useRegisterPropertyInterestMutation()
    const [updateFavoriteProperties, updateFavoritePropertyMutation] = useUpdateFavoritePropertiesMutation()
    const { data: user, isFetching: userFetching, refetch: refetchUser } = useGetUserMeQuery({})
    const navigation = useNavigation()
    const { translate, language } = useTranslation()
    const scrollY = useSharedValue(0)
    const scrollYCarousel = useSharedValue(0)
    const iconsVisible = useSharedValue(true)
    const mapRef = useRef<MapView>(null)

    useEffect(() => {
        if (showVideo) {
            navigation.navigate("HomeNFAnnoucementScreen")
        }
    }, [showVideo])

    const iconStyle = useAnimatedStyle(() => {
        return {
            opacity: withSpring(iconsVisible.value ? 1 : 0, {
                damping: 10,
                stiffness: 100,
            }),
        }
    })

    useEffect(() => {
        SecureStore.getItemAsync("token").then((token) => {
            if (token) {
                setIsAuth(true)
            } else {
                setIsAuth(false)
            }
        })
    }, [])
    const removeHtmlTags = (text: string) => {
        return text.replace(/<\/?[^>]+(>|$)/g, "")
    }

    // let unites = Array(property_api.acf.number_of_models || 0).fill(0)

    const { Tab, tabValue } = useTab({
        tabs: (property_api.acf.project_type || []).map((type) => ({
            title: removeHtmlTags(type.name_type),
        })),
    })

    const { Tab: Tab2, tabValue: tabValue2 } = useTab({
        tabs: [
            {
                title: "Property details",
                icon: (color: string) => <PropertyDetailsIcon color={color} />,
            },
            {
                title: "View map",
                icon: (color: string) => <MapIcon color={color} />,
            },
        ],
    })

    const registerInterest = () => {
        if (isAuth) {
            registerPropertyInterest({
                LeadSource: "Mobile App",
                firstName: user?.first_name,
                lastName: user?.last_name,
                mobileNumber: user?.phone_number.substring(4),
                email: user?.email,
                mobileCountryCode: "Saudi Arabia: +966",
                projectOfInterest: property_api.acf.project_name,
                recordType: "0128e0000011AgHAAU",
                leadOwner: "00G4L000001NYdbUAG",
                requesttype: "Register your interest",
                channel: Platform.OS === "android" ? "Android" : "iOS",
            })
                .unwrap()
                .then((response) => {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        textBody: translate("You will be contacted shortly"),
                    })
                    // navigation.goBack()
                })
        } else {
            //@ts-ignore
            navigation.navigate("FavoritProperty", { property_api })
        }
    }
    const scrollViewRef = useRef(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // useEffect(() => {
    //     let timer
    //     if (isModalVisible) {
    //         timer = setTimeout(() => {
    //             setModalVisible(false)
    //         }, 6000)
    //     }
    //     return () => clearTimeout(timer)
    // }, [isModalVisible])

    // useEffect(() => {
    //     if (currentImage) {
    //         setModalVisible(true)
    //     }
    // }, [currentImage])

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="light-content" backgroundColor="black" />

            <View style={{ zIndex: 1, flexDirection: language === "ar" ? "column" : "column-reverse" }}>
                <LinearGradient colors={["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0)"]} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100 }} />
                <Pressable style={[styles.iconContainer, styles.backArrowContainer]} onPress={() => navigation.goBack()}>
                    {language === "en" ? <ArrowLeftIcon /> : <RightArrowIcon color="black" />}
                </Pressable>
                <View style={[styles.rightIconContainer, { justifyContent: "flex-end" }]}>
                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                        <Pressable
                            style={[styles.iconContainer, { marginRight: -10, marginBottom: 7.5 }]}
                            onPress={() => {
                                iconsVisible.value = !iconsVisible.value
                                scrollY.value = 0
                                setIconsRender(!iconsRender)
                            }}
                        >
                            {iconsRender ? <MenuCloseIcon /> : <MenuIcon />}
                        </Pressable>

                        {iconsRender && (
                            <Animated.View style={[{ flexDirection: "column", alignItems: "center" }, iconStyle]}>
                                {property_api.acf.externalurlbrochure_copy && (
                                    <Pressable
                                        style={[styles.iconContainer, { marginRight: -10, marginBottom: 7.5 }]}
                                        onPress={() => {
                                            console.log("ab")
                                            OpenAnything.Web(property_api.acf.externalurlbrochure_copy)
                                            // Share.share({
                                            //     title: property_api.acf.project_name + " Brochure",
                                            //     url: property_api.acf.externalurlbrochure_copy,
                                            // })
                                        }}
                                    >
                                        <ShareIcon />
                                    </Pressable>
                                )}

                                <Pressable
                                    style={[
                                        styles.iconContainer,
                                        {
                                            marginRight: -10,
                                            marginBottom: 7.5,
                                        },
                                    ]}
                                    onPress={() => {
                                        // registerInterest()
                                        if (!isAuth) {
                                            //@ts-ignore
                                            navigation.navigate("FavoritProperty", {
                                                property_api: property_api,
                                            })
                                        } else {
                                            updateFavoriteProperties({ project_name: property_api.acf.project_name })
                                                .unwrap()
                                                .then((response) => {
                                                    if (response) {
                                                        if (response.includes(property_api.acf.project_name)) {
                                                            Toast.show({
                                                                type: ALERT_TYPE.SUCCESS,

                                                                textBody: translate("{title} saved to favorites", {
                                                                    title: property_api.title.rendered,
                                                                }),
                                                            })
                                                        } else {
                                                            Toast.show({
                                                                type: ALERT_TYPE.SUCCESS,

                                                                textBody: translate("{title} removed from favorites", {
                                                                    title: property_api.title.rendered,
                                                                }),
                                                            })
                                                        }
                                                        refetchUser()
                                                    }
                                                })
                                        }
                                    }}
                                >
                                    {updateFavoritePropertyMutation.isLoading ? (
                                        <ActivityIndicator size={14.5} />
                                    ) : user?.favorite_properties?.includes(property_api.acf.project_name) ? (
                                        <BookMarkpressed />
                                    ) : (
                                        <BookMark color="#ffffff20" />
                                    )}
                                </Pressable>

                                <Pressable
                                    style={[styles.iconContainer, { marginRight: -10, marginBottom: 7.5 }]}
                                    onPress={() => {
                                        Share.share({
                                            title: property_api.acf.project_name,
                                            url: property_api.link,
                                        })
                                    }}
                                >
                                    <DownloadIcon />
                                </Pressable>
                            </Animated.View>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                ref={scrollViewRef}
                scrollEventThrottle={16}
                /* onScroll={(event) => {
                    const currentScrollY = event.nativeEvent.contentOffset.y
                    scrollY.value = currentScrollY
                    scrollYCarousel.value = currentScrollY
                    if (currentScrollY >= 0) {
                        setIconsRender(false)
                    } else {
                        setIconsRender(true)
                    }
                }} */
            >
                <View
                    style={{
                        direction: "ltr",
                    }}
                >
                    <Carousel
                        images={[
                            ...(property_api._embedded["wp:featuredmedia"]?.map((el) => ({ uri: el.link })) || []),
                            ...(property_api.acf.project_gallery?.map((el) => ({ uri: el.link })) || []),
                        ]}
                        resizeValue="stretch"
                    />
                </View>
                <SafeAreaView>
                    <Tab2 />
                </SafeAreaView>

                {tabValue2 === 1 && (
                    <View style={styles.mapView}>
                        <MapView
                            style={styles.mapView}
                            ref={mapRef}
                            initialRegion={{
                                latitude: property_api.acf.location.lat,
                                longitude: property_api.acf.location.lng,
                                latitudeDelta: 0.0522,
                                longitudeDelta: 0.0221,
                            }}
                            showsUserLocation={true}
                        >
                            <Marker
                                coordinate={{
                                    latitude: property_api.acf.location.lat,
                                    longitude: property_api.acf.location.lng,
                                }}
                            >
                                <CustomMarkerView property={property_api} />
                            </Marker>
                        </MapView>
                    </View>
                )}

                {tabValue2 === 0 && (
                    <>
                        <View style={styles.titleContainer}>
                            <View>
                                <Text style={styles.name}>{property_api.title.rendered} </Text>
                                <View style={styles.locationWrapper}>
                                    <LocationIcon />
                                    <Text style={styles.locationText}>{property_api.city_properties[0]}</Text>
                                </View>
                            </View>
                            <View
                                style={[
                                    styles.statusWrapper,
                                    {
                                        backgroundColor: property_api.acf.available_project === "1" ? "#efefef" : property_api.acf.sold_out === "1" ? "#efefef" : "#efefef",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.status,
                                        { color: property_api.acf.available_project === "1" ? "#000000" : property_api.acf.sold_out === "1" ? "#000000" : "#000000" },
                                    ]}
                                >
                                    {property_api.acf.available_project === "1"
                                        ? translate("Available")
                                        : property_api.acf.sold_out === "1"
                                        ? translate("Sold out")
                                        : translate("Coming Soon")}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.separator} />
                        <Text style={styles.introduction}>{removeHtmlTagsAndTrim(property_api.acf.description)}</Text>
                        <View style={styles.flatListContainer}>
                            <FlatList
                                data={[
                                    {
                                        name: translate("Built up area"),
                                        value: `${property_api.acf.building_area || "N/A"} ${translate("sqm")}`,
                                        icon: <BuiltUpAreaIcon />,
                                    },
                                    {
                                        name: translate("Land area"),
                                        value: `${property_api.acf.land_area || "N/A"} ${translate("sqm")}`,
                                        icon: <PlotAreaIcon />,
                                    },
                                    {
                                        name: translate("No. of units"),
                                        value: `${property_api.acf.units || "N/A"}`,
                                        icon: <UnitIcon />,
                                    },
                                    {
                                        name: translate("No. of types"),
                                        value: `${property_api.acf.number_of_models || "N/A"}`,
                                        icon: <TypesIcon />,
                                    },
                                ]}
                                renderItem={({ item }) => <HomeDetails icon={item.icon} name={item.name} value={item.value} selectedSort={true} swidth="45%" />}
                                keyExtractor={(item, index) => "p" + index.toString() + item.name.toString()}
                                numColumns={2}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    width: "100%",
                                    alignSelf: "center",
                                }}
                                ItemSeparatorComponent={() => <View style={{ height: hp("3.5%") }} />}
                            />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: "100%" }}>
                            <Tab />
                        </ScrollView>
                    </>
                )}

                {tabValue2 === 0 &&
                    (property_api.acf.project_type || []).map((project, index) => {
                        return (
                            <View style={{ display: index !== tabValue ? "none" : "flex" }}>
                                <View style={styles.descriptionContainer}>
                                    <Text style={styles.descriptionValue}>{removeHtmlTags(project.name_type)}</Text>
                                </View>

                                <View
                                    style={{
                                        paddingLeft: wp("5%"),
                                        paddingRight: wp("5%"),
                                        paddingTop: wp("5%"),
                                        direction: "ltr",
                                    }}
                                >
                                    <Carousel
                                        images={(project.type_gallery || []).map(({ url }) => ({ uri: url }))}
                                        imageWidth="90%"
                                        onItemPress={({ uri }, index) => {
                                            setCurrentImage(uri)
                                        }}
                                    />
                                </View>

                                <FlatList
                                    data={[
                                        {
                                            name: translate("Plot area"),
                                            value: project.plot_area || "N/A",
                                        },
                                        {
                                            name: translate("Floors"),
                                            value: project.floors || "N/A",
                                        },
                                        {
                                            name: translate("Bedrooms"),
                                            value: project.no_of_bedrooms || "N/A",
                                        },
                                    ]}
                                    renderItem={({ item, index }) => (
                                        <View style={{ width: index === 1 ? wp("50%") : wp("15%") }}>
                                            <Text
                                                style={{
                                                    color: "#666666",
                                                    fontSize: wp("4%"),
                                                    fontFamily: "regular",
                                                    textAlign: "left",
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: wp("3%"),
                                                    // fontFamily: 'bold',
                                                    textAlign: "left",
                                                }}
                                            >
                                                {item.value}
                                            </Text>
                                        </View>
                                    )}
                                    style={{ alignSelf: "center" }}
                                    contentContainerStyle={styles.container}
                                    keyExtractor={(item, index) => "p2" + item.value.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    ItemSeparatorComponent={() => (
                                        <View
                                            style={{
                                                width: 1,
                                                backgroundColor: "#F2F2F2",
                                                marginHorizontal: wp("1%"),
                                            }}
                                        />
                                    )}
                                />
                            </View>
                        )
                    })}
            </ScrollView>

            <ImageView images={[{ uri: currentImage }]} imageIndex={0} visible={currentImage != ""} onRequestClose={() => setCurrentImage("")} />

            <View style={styles.buttonContainer}>
                <MaintButton
                    title={property_api.acf.sold_out === "1" ? `${translate("Register for similar Project")}` : `${translate("Register my interest")}`}
                    action={registerInterest}
                    backgroundColor="#000"
                    textColor="#fff"
                    style={{
                        height: hp("6%"),
                    }}
                    hasActivityIndicator={registerPropertyInterestMutation.isLoading ? true : false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#fcfcfc",
    },
    image: {
        width: wp("100%"),
    },
    iconContainer: {
        zIndex: 1,
        backgroundColor: "white",
        height: 31,
        width: 31,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: wp("1.5%"),
    },
    rightIconContainer: {
        position: "absolute",
        top: hp("5%"),
        right: wp("7.5%"),
        zIndex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backArrowContainer: {
        position: "absolute",
        top: hp("5%"),
        left: wp("7.5%"),
        marginHorizontal: 0,
    },
    liveConstructionContainer: {
        position: "absolute",
        top: hp("5%"),
        right: wp("7.5%"),
        zIndex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "black",
        paddingHorizontal: wp("2.5%"),
        paddingVertical: hp("2%"),
        borderRadius: 10,
    },
    liveConstructionText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: wp("2%"),
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: wp("90%"),
        alignSelf: "center",
        marginTop: hp("3.25%"),
    },
    locationWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationText: {
        fontSize: wp("3.75%"),
        fontFamily: "medium",
        marginLeft: wp("1%"),
        color: "#666666",
    },
    statusWrapper: {
        alignItems: "center",
        justifyContent: "center",
        height: hp("5.75%"),
        paddingHorizontal: wp("5.5%"),
    },
    status: {
        fontSize: wp("3.5%"),
        fontFamily: "medium",
        color: "#E5903B",
    },
    name: {
        marginBottom: hp("1%"),
        fontSize: wp("6.5%"),
        fontFamily: "medium",
    },
    mapView: {
        height: hp("60%"),
        width: wp("100%"),
    },
    separator: {
        width: wp("92.5%"),
        alignSelf: "center",
        height: 1,
        backgroundColor: "#F2F2F2",
        marginVertical: hp("2.25%"),
    },
    introduction: {
        width: wp("90%"),
        alignSelf: "center",
        fontSize: wp("4.25%"),
        fontFamily: "medium",
        color: "#666666",
        textAlign: "left",
        lineHeight: hp("3.25%"),
    },
    readMoreContainer: {
        flexDirection: "row",
        marginTop: hp("1.25%"),
        width: wp("90%"),
        alignSelf: "center",
        alignItems: "center",
    },
    readMoreText: {
        fontSize: wp("4.25%"),
        fontFamily: "medium",
        color: "#666666",
        marginRight: wp("1.5%"),
    },
    detailsContainer: {
        marginVertical: hp("3%"),
    },
    detailContainer: {
        width: wp("35%"),
        alignSelf: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    descriptionContainer: {
        width: wp("90%"),
        alignSelf: "center",
        marginTop: hp("3.25%"),
    },
    descriptionTitle: {
        fontSize: wp("5.50%"),
        color: "black",
        fontFamily: "regular",
        textAlign: "left",
    },
    descriptionValue: {
        fontSize: wp("5.25%"),
        fontFamily: "regular",
        color: "black",
        textAlign: "left",
    },
    imageContainer: {
        width: wp("90%"),
        alignSelf: "center",
        marginTop: hp("1.25%"),
    },
    descriptionText: {
        fontSize: wp("4.75%"),
        fontFamily: "regular",
        color: "#666666",
        width: wp("90%"),
        alignSelf: "center",
        lineHeight: wp("6%"),
        textAlign: "left",
    },
    container: {
        width: wp("90%"),
        paddingVertical: hp("2.5%"),
        paddingHorizontal: hp("0.5%"),
        alignSelf: "center",
        borderRadius: 15,
        marginTop: hp("3.25%"),
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
    },
    buttonContainer: {
        borderTopWidth: 1,
        borderTopColor: "#F2F2F2",
        width: wp("100%"),
        paddingVertical: hp("2%"),
        marginBottom: hp("2%"),
    },
    flatListContainer: {
        marginTop: hp("4%"), // Add the desired margin here
        marginRight: wp("5%"),
        marginLeft: wp("5%"),
        marginBottom: hp("4%"), // Add the desired margin here
    },
    tabItem: {
        marginRight: 10, // Add any other styling you need
        width: wp("100%"),
        backgroundColor: "",
    },
    markerText: {
        color: "white",
        fontFamily: "bold",
        fontSize: wp("3.75%"),
    },
    markerCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#85563aa7",
        borderColor: "#85563ae2",
        borderWidth: 2,
    },
    marker: {
        backgroundColor: "black",
        padding: 5,
        borderRadius: 5,
        paddingHorizontal: wp("2%"),
        paddingVertical: hp("0.5%"),
        height: hp("5%"),
        alignItems: "center",
        justifyContent: "center",
    },
    rectangle: {
        width: wp("2.5%"),
        height: wp("2.5%"),
        backgroundColor: "black",
        transform: [{ rotate: "45deg" }],
        position: "absolute",
        alignSelf: "center",
        top: hp("4.5%"),
        borderRadius: 3,
    },
})
