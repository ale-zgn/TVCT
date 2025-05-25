import { Text, Pressable, StyleSheet } from "react-native"
import React from "react"
import { useNavigation } from "@react-navigation/native"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { useTranslation } from "../../Services/hooks/useTranslation"

export default function CloseHeaderLeft() {
    const navigation = useNavigation()
    const { translate } = useTranslation()
    return (
        <Pressable onPress={() => navigation.goBack()} style={styles.wrapper}>
            <Text style={{ color: "#B2B2B2" }}>{translate("Close")}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        padding: wp("1%"),
    },
})
