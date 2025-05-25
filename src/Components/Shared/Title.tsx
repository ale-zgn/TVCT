import { Text, StyleSheet, View, Pressable } from "react-native"
import React from "react"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { useTranslation } from "../../Services/hooks/useTranslation"

export default function Title({ value, viewAll, action }: { value: string; viewAll?: boolean; action?: () => void }) {
    const { translate } = useTranslation()
    return (
        <Pressable style={styles.container} onPress={action}>
            <Text style={styles.title}>{value}</Text>
            {viewAll && <Text style={styles.viewAll}>{translate("View All")}</Text>}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        width: wp("90%"),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: wp("6"),
        fontFamily: "medium",
        marginTop: hp("1.5%"),
    },
    viewAll: {
        fontSize: wp("4%"),
        color: "#7F7F7F",
        fontFamily: "medium",
        marginTop: hp("1.5%"),
        marginLeft: wp("5%"),
    },
})
