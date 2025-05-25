import { View, Text, StyleSheet } from "react-native"
import React, { useEffect, useState } from "react"
// import RNPickerSelect from 'react-native-picker-select';
import Picker2 from "react-native-picker-select"
import { ArrowDownIcon } from "../../../assets/svgs/Svg"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { useTranslation } from "../../Services/hooks/useTranslation"

export default function Picker({
    title = "Message",
    items = [],
    placeholder,
    onValueChange,
    styling,
    value,
}: {
    title?: string
    items?: any
    placeholder?: string
    onValueChange: (value: any) => void
    styling?: boolean
    value?: string
}) {
    const { translate, language } = useTranslation()
    const [selectedValue, setSelectedValue] = useState<string>()

    useEffect(() => {
        setSelectedValue(value || placeholder)
    }, [value, placeholder])

    const handleValueChange = (value: any) => {
        setSelectedValue(value)
        onValueChange(value)
    }

    return (
        <View style={styles.detailsContainer}>
            <Text style={styling ? { alignSelf: "flex-start", fontFamily: "regular", color: "#666666", fontSize: wp("5.75%"), marginBottom: hp("2%") } : styles.message}>
                {translate(`${title}`)}
            </Text>
            <Picker2
                onValueChange={handleValueChange}
                items={items}
                value={selectedValue}
                placeholder={{
                    label: `${translate(`${placeholder}`)}`,
                    value: null,
                }}
                style={{
                    inputIOS: { ...styles.pickerContainer, textAlign: language === "ar" ? "right" : "left" },
                    inputAndroid: { ...styles.pickerContainer, textAlign: language === "ar" ? "right" : "left" },
                    iconContainer: {
                        top: wp("4.5%"),
                        right: wp("3%"),
                    },
                    placeholder: {
                        color: "#000",
                    },
                }}
                fixAndroidTouchableBug={true}
                useNativeAndroidPickerStyle={false}
                // @ts-ignore
                Icon={() => {
                    return <ArrowDownIcon color="#000" />
                }}
                doneText={translate("Done")}
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
        paddingVertical: hp("4%"),
        backgroundColor: "#fff",
        marginTop: hp("2%"),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    message: {
        alignSelf: "flex-start",
        fontFamily: "medium",
        color: "#121212",
        fontSize: wp("5.75%"),
        marginBottom: hp("2%"),
    },
    textInput: {
        fontFamily: "regular",
        color: "#121212",
        fontSize: wp("5%"),
        borderWidth: 2,
        borderColor: "#E5E5E5",
        width: wp("80%"),
        minHeight: hp("20%"),
        paddingHorizontal: wp("5%"),
        paddingTop: hp("2%"),
    },
    pickerContainer: {
        fontFamily: "regular",
        fontSize: wp("5%"),
        color: "#121212",
        borderColor: "#F2F2F2",
        borderWidth: 2,
        height: hp("6%"),
        width: wp("80%"),
        paddingLeft: wp("2.75%"),
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingRight: wp("7.5%"),
    },
})
