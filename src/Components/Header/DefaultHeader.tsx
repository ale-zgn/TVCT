import { View, Text, Pressable, StyleSheet } from "react-native"
import React, { useState, useEffect } from "react"
import { NotificationIcon } from "../../../assets/svgs/Svg"
import { useNavigation } from "@react-navigation/native"
import { useGetUserMeQuery, useGetUserNotificationsQuery, useGetUserSurveysQuery } from "../../Services/API"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { S3Image } from "../Shared/S3Image"
import useSocket from "../../Services/hooks/useSocket"
import * as SecureStore from "expo-secure-store"

export default function DefaultHeader() {
    const navigation = useNavigation()
    const { data: user } = useGetUserMeQuery({})
    const { data: notifications, refetch: notificationsRefetch } = useGetUserNotificationsQuery({})
    const { data: surveys, refetch: surveysRefetch } = useGetUserSurveysQuery()

    const [notificationCount, setNotificationCount] = useState(0)
    const [surveyCount, setSurveyCount] = useState(0)

    useEffect(() => {
        let count = 0
        notifications?.forEach((notification) => {
            if (!notification.is_opened) {
                count++
            }
        })
        setNotificationCount(count)
    }, [notifications])

    useEffect(() => {
        const updateSurveyCount = async () => {
            const openedSurveyLinks = JSON.parse(await SecureStore.getItemAsync("survey_links")) || []
            let count = 0

            surveys?.surveyLinks?.forEach((link) => {
                if (link && !openedSurveyLinks.includes(link)) {
                    count++
                }
            })
            setSurveyCount(count)
        }

        updateSurveyCount()
    }, [surveys])

    useSocket({
        onReactive: async (event) => {
            if ((event.action === "create" || event.action === "update") && event.model === "Notification") {
                notificationsRefetch()
            }
        },
    })

    return (
        <View style={styles.Container}>
            <Pressable
                style={styles.IconContainer}
                onPress={() => {
                    //@ts-ignore
                    navigation.navigate("ProfileStack", { screen: "NotificationModal" })
                }}
            >
                <NotificationIcon />
                {(notificationCount > 0 || surveyCount > 0) && (
                    <View style={styles.notificationIcon}>
                        <Text style={{ color: "white", fontSize: wp("2%"), alignSelf: "center" }}>{notificationCount + surveyCount}</Text>
                    </View>
                )}
            </Pressable>
            <Pressable
                onPress={() => {
                    //@ts-ignore
                    navigation.navigate("ProfileStack", { screen: "ProfileModal" })
                }}
            >
                <S3Image file={user?.image} folder={"users/images"} customStyle={styles.image} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: "row",
    },
    IconContainer: {
        width: 32.5,
        height: 32.5,
        marginRight: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#F2F2F2",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 32.5,
        height: 32.5,
        marginRight: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#F2F2F2",
        justifyContent: "center",
        alignItems: "center",
    },
    notificationIcon: {
        width: 10,
        height: 10,
        position: "absolute",
        right: -3,
        top: -2,
        backgroundColor: "#3DBC17",
        borderRadius: 100,
    },
})
