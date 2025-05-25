import { View, Text, StyleSheet, Pressable, FlatList, Alert } from "react-native"
import React from "react"
import useSearchBar from "../../Components/Shared/useSearchBar"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import {
    CalendarIcon,
    ContactIcon,
    FAQIcon,
    FriendIcon,
    LeftArrowIcon,
    MarketplaceIcon,
    PaymentIcon,
    PrivacyPolicyIcon,
    RaiseTicketIcon,
    RewardIcon,
    RightArrowIcon,
    WarrantyIcon,
} from "../../../assets/svgs/Svg"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "../../Services/hooks/useTranslation"

export default function ServicesScreen() {
    const { translate } = useTranslation()

    const services = [
        {
            title: translate("Raise a ticket"),
            icon: <RaiseTicketIcon />,
            navigation: "RaiseATicket",
            backgroundColor: "#FCF0F0",
        },
        {
            title: translate("Appointment"),
            icon: <CalendarIcon />,
            navigation: "Appointments",
            backgroundColor: "#F2F0FC",
        },
        {
            title: translate("Payments"),
            icon: <PaymentIcon />,
            navigation: "PaymentScreen",
            backgroundColor: "#E9F2FA",
        },
        {
            title: translate("Warranty"),
            icon: <WarrantyIcon />,
            navigation: "Warranty",
            backgroundColor: "#F5EAE5",
        },
        {
            title: translate("Refer a friend"),
            icon: <FriendIcon />,
            navigation: "ReferAFriend",
            backgroundColor: "#FDF4EB",
        },
        {
            title: translate("FAQ"),
            icon: <FAQIcon />,
            navigation: "FAQ",
            backgroundColor: "#FCF0FB",
        },
        { title: translate("Privacy policy"), icon: <PrivacyPolicyIcon />, navigation: "PrivacyPolicy", backgroundColor: "#E0F7E5" },
        {
            title: translate("Contact"),
            navigation: "Contact",
            icon: <ContactIcon />,
            backgroundColor: "#FFFAE8",
        },
        /* {
            title: translate("Rewards") + " (" + `${translate("Coming Soon")}` + ")",
            icon: <RewardIcon />,
            navigation: "Rewards",
            backgroundColor: "#F0F6FC",
        },
        {
            title: translate("Store") + " (" + `${translate("Coming Soon")}` + ")",
            icon: <MarketplaceIcon />,
            navigation: "Store",
            backgroundColor: "#EBF8E7",
        }, */
    ]

    return (
        <View style={styles.container}>
            <FlatList
                data={services}
                renderItem={({ item }) => <ServiceItem service={item} />}
                keyExtractor={(item) => item.title}
                ItemSeparatorComponent={() => <View style={styles.flatListSeparator} />}
                contentContainerStyle={{ paddingTop: hp("1%") }}
            />
        </View>
    )
}

function ServiceItem({ service }: { service: any }) {
    const navigation = useNavigation()
    const { language } = useTranslation()
    const { translate } = useTranslation()

    return (
        <Pressable
            style={styles.serviceItemContainer}
            onPress={() => {
                if (service.navigation === "Rewards" || service.navigation === "Store") {
                    Alert.alert(`${translate("Coming Soon")}`, `${translate("This feature is coming soon")}`)
                    return
                }
                //@ts-ignore
                navigation.navigate(service.navigation)
            }}
        >
            <View style={[styles.serviceItemLeft]}>
                <View style={[styles.iconContainer, { backgroundColor: service.backgroundColor }]}>{service.icon}</View>
                <Text style={[styles.serviceTitle, { color: service.navigation === "Rewards" || service.navigation === "Store" ? "grey" : "black" }]}>{service.title}</Text>
            </View>
            {language === "en" && !(service.navigation === "Rewards" || service.navigation === "Store") ? (
                <RightArrowIcon />
            ) : language === "ar" && !(service.navigation === "Rewards" || service.navigation === "Store") ? (
                <LeftArrowIcon />
            ) : null}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fcfcfc",
    },
    flatListSeparator: {
        height: 1,
        width: wp("90%"),
        backgroundColor: "#F2F2F2",
        alignSelf: "center",
    },
    serviceItemContainer: {
        width: wp("90%"),
        alignSelf: "center",
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("1.5%"),
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    serviceItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    serviceTitle: {
        fontSize: wp("5%"),
        fontFamily: "regular",
        color: "#000",
        marginLeft: wp("3.5%"),
    },
    iconContainer: {
        width: wp("10%"),
        height: wp("10%"),
        justifyContent: "center",
        alignItems: "center",
    },
    comingSoonText: {
        fontSize: wp("4.5%"),
        fontFamily: "regular",
        color: "#85553a", // Set the color as needed
        marginLeft: wp("3.5%"),
    },
})
