import { View, Text, StyleSheet, TextInput } from "react-native"
import React from "react"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { useTranslation } from "../../Services/hooks/useTranslation"
export default function Message({
    text,
    placeholder,
    setText,
    style,
    textInputStyle,
    title,
}: {
    text: string
    placeholder?: string
    setText: (text: string) => void
    style?: object
    textInputStyle?: object
    title?: string
}) {
    const { translate, language } = useTranslation()
    return (
        <View style={[styles.detailsContainer, style]}>
            <Text style={styles.message}>{title ? translate(`${title}`) : translate("Message")}</Text>
            <TextInput
                textAlignVertical="top"
                style={[styles.textInput, textInputStyle]}
                onChangeText={(text) => setText(text)}
                multiline={true}
                placeholder={placeholder ? translate(`${placeholder}`) : translate("Enter your message here")}
                placeholderTextColor={"#B7B3B3"}
                textAlign={language == "ar" ? "right" : "left"}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    detailsContainer: {
        justifyContent: "space-between",
        paddingHorizontal: wp("5%"),
        marginHorizontal: wp("5%"),
        width: wp("90%"),
        paddingVertical: hp("3.5%"),
        backgroundColor: "#fff",
        marginTop: hp("2%"),
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    message: {
        fontFamily: "medium",
        color: "#121212",
        fontSize: wp("5.75%"),
        marginBottom: hp("2%"),
        alignSelf: "flex-start",
    },
    textInput: {
        fontFamily: "regular",
        color: "#121212",
        fontSize: wp("5%"),
        borderWidth: 2,
        borderColor: "#F2F2F2",
        width: wp("80%"),
        minHeight: hp("20%"),
        paddingHorizontal: wp("5%"),
        paddingTop: hp("2%"),
    },
})
