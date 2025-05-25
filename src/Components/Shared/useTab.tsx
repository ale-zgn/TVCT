import { View, StyleSheet, Text, Pressable } from "react-native"
import React from "react"

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import { useTranslation } from "../../Services/hooks/useTranslation"

interface TabData {
    title: string
    // can be null
    icon?: (color: string) => JSX.Element
}

interface UseTabProps {
    tabs: TabData[]
}

const useTab = ({ tabs }: UseTabProps) => {
    const [tabValue, setTabValue] = React.useState(0)
    const [ctabs, setTabs] = React.useState(tabs)
    const { translate, language } = useTranslation()

    React.useEffect(() => {
        setTabs(
            tabs.map((tab) => ({
                ...tab,
                title: translate(tab.title),
            })),
        )
    }, [language])
    const Tab = () => {
        return (
            <View style={styles.wrapper}>
                {ctabs.map((tab, index) => (
                    <Pressable
                        key={index}
                        style={[
                            styles.tabContainer,
                            {
                                borderBottomColor: tabValue === index ? "#000000" : "#F2F2F2",
                            },
                        ]}
                        onPress={() => setTabValue(index)}
                    >
                        {tab.icon && tab.icon(tabValue === index ? "#000000" : "#707070")}
                        <Text
                            style={[
                                styles.title,
                                {
                                    color: tabValue === index ? "#000000" : "#707070",
                                },
                            ]}
                        >
                            {translate(tab.title)}
                        </Text>
                    </Pressable>
                ))}
            </View>
        )
    }

    return { Tab, tabValue, setTabs }
}

export default useTab

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 15,
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "white",
        alignItems: "flex-end",
        marginTop: hp("0.5%"),
    },
    tabContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        borderBottomWidth: 2,
        paddingVertical: hp("1.2%"),
        flexWrap: "nowrap",
        paddingHorizontal: wp("3%"),
    },
    title: {
        fontSize: wp("4.75%"),
        fontFamily: "regular",
        color: "#000",
        marginLeft: wp("2%"),
        flexWrap: "wrap",
    },
})
