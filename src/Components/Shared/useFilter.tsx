import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { ArrowDownIcon } from "../../../assets/svgs/Svg"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import Picker from "react-native-picker-select"
import { useTranslation } from "../../Services/hooks/useTranslation"

interface FilterData {
    label: string
    value: string | number
}

interface FilterProps<T> {
    title: string
    style?: any
    data: any
    showPicker?: boolean
}

const useFilter = ({ title, style, data, showPicker = true }: FilterProps<Record<string, number>>) => {
    const { translate } = useTranslation()
    const [selectedFilter, setSelectedFilter] = React.useState(null)

    const Filter = React.useMemo(() => {
        const count = data ? data.length : 0
        return () => (
            <View style={[styles.titleContainer, style]}>
                <Text style={styles.title}>
                    {translate(title)} ({count})
                </Text>
            </View>
        )
    }, [data?.length, title])

    return { Filter, selectedFilter }
}

export default useFilter

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: wp("90%"),
        marginVertical: hp("2.5%"),
        alignSelf: "center",
    },
    title: {
        fontSize: wp("6.5%"),
        fontFamily: "regular",
    },
    inputStyle: {
        fontSize: wp("4%"),
        fontFamily: "medium",
        backgroundColor: "#EDEDED",
        padding: wp("1.5%"),
        paddingLeft: wp("2.75%"),
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingRight: wp("7.5%"),
    },
})
