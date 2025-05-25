import { View, TextInput, StyleSheet } from "react-native"
import React, { useState } from "react"

import { SearchIcon } from "../../../assets/svgs/Svg"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { useTranslation } from "../../Services/hooks/useTranslation"

const useSearchBar = ({ placeholder, withPadding }: { placeholder: string; withPadding?: boolean }) => {
    const [value, onChangeText] = useState("")
    const { translate, language } = useTranslation()
    const searchWrapperStyle = withPadding ? { paddingBottom: hp("2.5%"), paddingTop: hp("2.5%") } : { paddingBottom: hp("1%"), paddingTop: hp("1%") }

    return {
        value,
        onChangeText,
        searchBar: (
            <View style={[styles.searchWrapper, searchWrapperStyle]}>
                <View style={styles.wrapper}>
                    <SearchIcon />
                    <TextInput
                        style={styles.customInput}
                        placeholder={translate(`${placeholder}`)}
                        placeholderTextColor="#B5B5B5"
                        value={value}
                        onChangeText={(text: string) => {
                            onChangeText(text)
                        }}
                        autoCorrect={false}
                        textAlign={language == "ar" ? "right" : "left"}
                    />
                </View>
            </View>
        ),
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: wp("90%"),
        paddingVertical: hp("1.5%"),
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        paddingHorizontal: wp("5%"),
    },
    customInput: {
        marginLeft: wp("3%"),
        fontFamily: "regular",
        fontSize: wp("4.5%"),
        lineHeight: wp("4.5%"),
        flex: 1,
    },
    searchWrapper: {
        backgroundColor: "#fff",
    },
})

export default useSearchBar
