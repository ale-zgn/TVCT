import { View, StyleSheet, TextInput, Text } from "react-native"
import React from "react"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { Controller } from "react-hook-form"
import { useTranslation } from "../../Services/hooks/useTranslation"

interface InputProps {
    placeholder: string
    control: any
    name: string
    rules: any
    errors: {
        [key: string]: any
    }
    containerStyle?: any
    icon?: JSX.Element
    title?: string
    width?: number
    ref?: any
    onSubmitEditing?: any
}
export default function Input({ placeholder, control, name, rules, errors, containerStyle, icon, title, width, onSubmitEditing }: InputProps) {
    const { language } = useTranslation()
    return (
        <View>
            {title ? <Text style={styles.inputLabel}>{title}</Text> : null}
            <View style={[styles.container, containerStyle]}>
                <Controller
                    control={control}
                    rules={rules}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder={placeholder}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={[
                                styles.input,
                                {
                                    width: icon ? wp(`${width}% - 50`) : wp(`${width}%`),
                                },
                            ]}
                            placeholderTextColor={"#666666"}
                            onSubmitEditing={onSubmitEditing}
                            textAlign={language == "ar" ? "right" : "left"}
                        />
                    )}
                    name={name}
                />
                {icon ? icon : null}
            </View>
            {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: hp("7.25%"),
        backgroundColor: "#F2F2F2",
        paddingHorizontal: wp("3"),
    },
    input: {
        fontFamily: "regular",
        fontSize: wp("5%"),
        width: "100%",
        color: "#121212",
        flex: 1,
    },
    inputLabel: {
        fontFamily: "regular",
        fontSize: wp("5.5%"),
        color: "#666666",
        marginBottom: hp("1%"),
        textAlign: "left",
    },
    error: {
        color: "#FF0000",
        fontSize: wp("4.5%"),
        fontFamily: "regular",
        marginTop: hp("1%"),
        textAlign: "left",
    },
})
