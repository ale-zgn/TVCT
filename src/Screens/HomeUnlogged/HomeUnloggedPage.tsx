import { StyleSheet, Text, ImageBackground, Pressable, View, TouchableOpacity, Image } from "react-native"
import React, { useEffect, useState } from "react"
import { StatusBar } from "react-native"
import MaintButton from "../../Components/Shared/MaintButton"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { useNavigation } from "@react-navigation/native"
import { ArrowDownIcon, CloseIcon } from "../../../assets/svgs/Svg"
import { useTranslation } from "../../Services/hooks/useTranslation"
import {
    useGetArticlesQuery,
    useGetPropertiesQuery,
    useLazyGetArticlesQuery,
    useLazyGetBannersQuery,
    useLazyGetPropertiesQuery,
    useShowAnnouncementvideoQuery,
} from "../../Services/API"
import { useAppProvider } from "../../Services/hooks/AppProvider"
import { Asset } from "expo-asset"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { Video, ResizeMode } from "expo-av"
import { getItemAsync, setItemAsync } from "expo-secure-store"
import { WPProperty } from "../../Interfaces/APIWP"
import * as SecureStore from "expo-secure-store"

export default function HomeUnloggedPage() {
    const navigation = useNavigation()
    const { translate, language: selectedLanguage, switchLanguage } = useTranslation()
    const { clearFilters } = useAppProvider()
    const [triggerProperties] = useLazyGetPropertiesQuery({})
    const [triggerBanners] = useLazyGetBannersQuery({})
    const [triggerArticles] = useLazyGetArticlesQuery({})
    const { data: annoucementNotification, refetch: annoucementRefetch } = useShowAnnouncementvideoQuery()
    const { data: properties } = useGetPropertiesQuery(selectedLanguage)
    const [isAuth, setIsAuth] = useState(false)
    useEffect(() => {
        SecureStore.getItemAsync("token").then((token) => {
            setIsAuth(token ? true : false)
        })
    }, [])
    useEffect(() => {
        triggerProperties(selectedLanguage)
        triggerBanners(selectedLanguage)
        triggerArticles(selectedLanguage)
    }, [])

    useEffect(() => {
        const handleAnnoucementFlow = async () => {
            const isVideoShown = await getItemAsync("isVideoShown")
            console.log("Stored video shown data: ", isVideoShown, annoucementNotification)

            if (isVideoShown === null && annoucementNotification === true) {
                console.log("here before navigate")

                //@ts-ignore
                navigation.navigate("PropertyDetails", {
                    property_api: properties?.find((property: WPProperty) => {
                        return property?.acf?.project_name === "Nesaj Town AlFursan"
                    }),
                    showVideo: true,
                })
                await setItemAsync("isVideoShown", "true")
            }
        }
        if (properties) {
            setTimeout(() => {
                //@ts-ignore
                handleAnnoucementFlow()
            }, 1000)
        }
    }, [annoucementNotification, properties])

    return (
        <ImageBackground source={require("../../../assets/images/startPageBackground.jpg")} style={styles.miniContainer}>
            <Pressable
                style={styles.languageContainer}
                onPress={() => {
                    selectedLanguage === "ar" ? switchLanguage("en") : switchLanguage("ar")
                    clearFilters()
                }}
            >
                <Text style={styles.languageText}>{selectedLanguage === "ar" ? "English" : "العربية"}</Text>
            </Pressable>
            {/* <Pressable style={styles.miniContainer}> */}

            <StatusBar barStyle="light-content" backgroundColor="black" />

            <Text style={styles.subTitle}>{translate("Welcome to wissal app")}</Text>
            <Text style={styles.title}>{translate("Location de voiture premium en Algérie.")}</Text>

            <MaintButton
                title={translate("Discover our properties")}
                backgroundColor="white"
                textColor="black"
                textFontFamily="semiBold"
                textFontSize={wp("6%")}
                style={{
                    borderWidth: 0,
                    borderColor: "#452C21",
                    height: hp("8%"),
                    marginTop: hp("3.5%"),
                    marginBottom: hp("-2%"),
                }}
                defaultMargin={hp("0.25%")}
                action={() => {
                    console.log(isAuth)

                    //@ts-ignore
                    isAuth ? navigation.navigate("TabNavigator") : navigation.navigate("LoginStack")
                }}
            />
            {/* </Pressable> */}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        top: 12,
        left: 12,
        width: wp("9%"),
        height: wp("9%"),
        justifyContent: "center",
        alignItems: "center",

        borderRadius: 25,
        backgroundColor: "white",
    },

    container: {
        flex: 1,
        backgroundColor: "#8f8fa3",
        justifyContent: "space-between",
        paddingBottom: hp("1%"),
    },
    miniContainer: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "flex-end",
        paddingBottom: hp("10%"),
    },
    title: {
        color: "#B7B9BA",
        fontSize: wp("4.25%"),
        fontFamily: "regular",
        marginLeft: wp("5%"),
        marginBottom: hp("2%"),
        textAlign: "left",
    },
    subTitle: {
        color: "#fff",
        fontSize: wp("10%"),
        fontFamily: "medium",
        paddingHorizontal: wp("5%"),
        width: wp("82.5%"),
        alignSelf: "flex-start",
        lineHeight: wp("11.5%"),
        marginBottom: hp("2%"),
        textAlign: "left",
    },

    languageText: {
        color: "white",
        fontSize: wp("5%"),
        marginRight: wp("5%"),
        fontFamily: "regular",
    },
    languageContainer: {
        // flexDirection: "row",
        // width: wp("100%"),
        // alignItems: "center",
        // justifyContent: "flex-end",
        top: hp("7%"),
        right: 0,
        alignSelf: "center",
        position: "absolute",
    },
})
