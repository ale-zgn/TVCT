import { useNavigation, useRoute } from '@react-navigation/native'
import React, { JSX, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as OpenAnything from 'react-native-openanything'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import {
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowUp,
    BathRoomIcon,
    BedRoomIcon,
    CalendarIcon,
    CameraIcon,
    CarShadesIcon,
    ConceiledACIcon,
    DiwaniyaRoomIcon,
    DocumentationIcon,
    DriverRoomIcon,
    ElevatorIcon,
    FloorIcon,
    InteriorDesignPackage,
    KitchenIcon,
    LandscapeIcon,
    LocationIcon,
    MaidsRoomIcon,
    MapIcon,
    ParkingTentIcon,
    PaymentIcon,
    PergolaIcon,
    PropertyDetailsIcon,
    PropertyIcon,
    RaiseTicketIcon,
    RightArrowIcon,
    RoofTerraceIcon,
    SmartHomeSystemIcon,
    SwimmingPoolIcon,
    WarrantyIcon,
} from '../../../assets/svgs/Svg'
import Carousel from '../../Components/Shared/carousel'
import { HomeDetails2 } from '../../Components/Shared/HomeDetails'
import useTab from '../../Components/Shared/useTab'
import { useGetPropertiesQuery, useGetUserPropertyQuery } from '../../Services/API'
import { useTranslation } from '../../Services/hooks/useTranslation'

import { Alert } from 'react-native'
import { WPProperty } from '../../Interfaces/APIWP'

interface EventAndNewsInterface {
    id: number
    type: string
    date: string
    title: string
    location?: string
    hours?: string
}

interface ProjectUpdateItemInterface {
    title: string
    date: string
    image: any
}

interface PropertyDetail {
    name: string
    value: string | number | boolean | null | undefined
    icon: JSX.Element
}

export default function MyPropertyDetails() {
    const [propertyFromWP, setPropertyFromWP] = useState<WPProperty | null>(null)

    const navigation = useNavigation()
    const { translate, language } = useTranslation()
    const mapRef = useRef<MapView>(null)

    const route = useRoute()
    const { property_id } = route.params as { property_id: number }
    const { data: property, isFetching: propretyIsFetching, refetch } = useGetUserPropertyQuery(property_id)
    const { data: propertiesFromWP } = useGetPropertiesQuery(language)
    const [showArrowDown, setShowArrowDown] = useState<boolean>(false)
    const [visibleItems, setVisibleItems] = useState<PropertyDetail[]>()
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    useEffect(() => {
        const propertyDetails = [
            { name: translate('Property'), value: property?.type, icon: <PropertyIcon /> },
            { name: translate('Floor'), value: property?.floor_number, icon: <FloorIcon /> },
            { name: translate('Bedrooms'), value: property?.bedroom_number, icon: <BedRoomIcon /> },
            { name: translate('Bathrooms'), value: property?.bathroom_number, icon: <BathRoomIcon /> },
            { name: translate('Driver Room'), value: property?.driver_room, icon: <DriverRoomIcon /> },
            { name: translate('Swimming Pool'), value: property?.swimming_pool, icon: <SwimmingPoolIcon /> },
            { name: translate('Elevator'), value: property?.elevator, icon: <ElevatorIcon /> },
            { name: translate('Pergola'), value: property?.pergola, icon: <PergolaIcon /> },
            { name: translate('Roof Terrace'), value: property?.roof_terace, icon: <RoofTerraceIcon /> },
            { name: translate('Kitchen'), value: property?.kitchen, icon: <KitchenIcon /> },
            { name: translate('Parking Tent'), value: property?.parking_tent, icon: <ParkingTentIcon /> },
            { name: translate('Diwaniya Room'), value: property?.diwanya_room, icon: <DiwaniyaRoomIcon /> },
            { name: translate('Maid’s Room'), value: property?.maid_s_room, icon: <MaidsRoomIcon /> },
            { name: translate('Conceiled AC'), value: property?.conceiled_ac, icon: <ConceiledACIcon /> },
            { name: translate('Landscape'), value: property?.landscape, icon: <LandscapeIcon /> },
            { name: translate('Smart Home System'), value: property?.smart_home_system, icon: <SmartHomeSystemIcon /> },
            { name: translate('Car Shades'), value: property?.car_shades, icon: <CarShadesIcon /> },
            { name: translate('Dewania'), value: property?.dewania, icon: <DiwaniyaRoomIcon /> },
            { name: translate('Interior Design Package'), value: property?.interior, icon: <InteriorDesignPackage /> },
        ]
        const filteredItems = propertyDetails.filter((item) => item.value)
        setShowArrowDown(filteredItems.length > 4 ? true : false)
        const itemsToShow = isExpanded ? filteredItems : filteredItems.slice(0, 4)
        setVisibleItems(itemsToShow)
    }, [property, isExpanded])

    const toggleItems = () => {
        setIsExpanded(!isExpanded)
    }

    const { Tab, tabValue } = useTab({
        tabs: [
            {
                title: 'Property details',
                icon: (color: string) => <PropertyDetailsIcon color={color} />,
            },
            {
                title: 'View map',
                icon: (color: string) => <MapIcon color={color} />,
            },
        ],
    })

    const CustomMarkerView = ({ property }: { property: WPProperty }) => {
        return (
            <View style={styles.marker}>
                <Text style={styles.markerText}>{property.title.rendered}</Text>
                <View style={styles.rectangle} />
            </View>
        )
    }
    //@ts-ignore

    useEffect(() => {
        if (property) {
            const matchingProperty = propertiesFromWP?.find((p) => {
                /* if (property.name === "Ewan Sedra 3") {
                    return p.acf.project_name === "Ewan Sedra"
                } else { */
                return p.acf.project_name === property.name
                /* } */
            })
            if (matchingProperty) {
                setPropertyFromWP(matchingProperty)
            }
        }
    }, [property])

    const renderItem = ({ item }: { item: PropertyDetail }) => {
        // Only pass value prop for specific properties
        const showValue =
            item.name === translate('Bathrooms') ||
            item.name === translate('Bedrooms') ||
            item.name === translate('Floor') ||
            item.name === translate('Property')
        return <HomeDetails2 icon={item.icon} name={item.name} value={showValue ? item.value : null} selectedSort={true} swidth={wp('17%')} />
    }

    const QuickAccessItems = [
        {
            title: translate('Raise new Ticket'),
            icon: <RaiseTicketIcon />,
            navigation: 'RaiseANewTicket',
        },
        {
            title: translate('Appointment'),
            icon: <CalendarIcon />,
            navigation: 'AppointmentsNew',
        },
        {
            title: translate('Docs'),
            icon: <DocumentationIcon />,
            navigation: 'Documentations',
        },
        /* {
            title: translate("Store"),
            icon: <MarketplaceIcon />,
            navigation: "ComingSoon",
        }, */
        // {
        //     title: translate("Floor plan"),
        //     icon: <FloorPlanIcon />,
        // },
        {
            title: translate('Payments'),
            icon: <PaymentIcon />,
            navigation: 'PaymentScreen',
        },
        {
            title: translate('Warranty'),
            icon: <WarrantyIcon />,
            navigation: 'Warranty',
        },
        // {
        //     title: translate("Progression"),
        //     icon: <ProgressionIcon />,
        // },
        // {
        //     title: translate("Contact"),
        //     icon: <ContactIcon />,
        //     navigation: "Contact",
        // },
    ]

    return (
        <>
            {property && !propretyIsFetching ? (
                <ScrollView
                    style={styles.wrapper}
                    contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Pressable style={styles.backArrowContainer} onPress={() => navigation.goBack()}>
                        {language === 'en' ? <ArrowLeftIcon /> : <RightArrowIcon />}
                    </Pressable>

                    {propertyFromWP?.acf.live_construction && (
                        <Pressable style={styles.liveConstructionContainer} onPress={() => OpenAnything.Web(propertyFromWP?.acf.live_construction)}>
                            <CameraIcon />
                            <Text style={styles.liveConstructionText}>{translate('Live Construction')}</Text>
                        </Pressable>
                    )}

                    {propertyFromWP && (
                        <View
                            style={{
                                direction: 'ltr',
                                width: '100%',
                            }}>
                            <Carousel
                                images={[propertyFromWP._embedded['wp:featuredmedia'][0], ...(propertyFromWP.acf.project_gallery || [])].map(({ link }) => ({
                                    uri: link,
                                }))}
                            />
                        </View>
                    )}
                    <SafeAreaView>
                        <Tab />
                    </SafeAreaView>

                    {tabValue === 0 && (
                        <ScrollView style={{ flex: 1 }}>
                            <View style={styles.titleContainer}>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Text style={styles.name}>{propertyFromWP?.title.rendered}</Text>
                                    <View style={styles.locationWrapper}>
                                        <LocationIcon />
                                        <Text style={styles.locationText}>{propertyFromWP?.city_properties}</Text>
                                    </View>
                                </View>

                                <View style={[styles.statusWrapper, { borderColor: '#3DBC17' }]}>
                                    <Text style={[styles.status, { color: '#3DBC17' }]}>
                                        {property.construction_percentage < 100
                                            ? `${translate('Under construction')} ${property.construction_percentage || 0}%` +
                                              (property.completion_date ? ` ${translate('exp')} ${property.completion_date}` : '')
                                            : property.construction_percentage === 100
                                            ? translate('Construction Completed')
                                            : ''}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.propertyDetailsContainer}>
                                <View style={styles.propertyDetailsWrapper}>
                                    <FlatList
                                        data={visibleItems}
                                        renderItem={renderItem}
                                        keyExtractor={(item, index) => 'p' + index.toString() + item.name.toString()}
                                        numColumns={4}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{
                                            width: wp('80%'),
                                            alignSelf: 'center',
                                        }}
                                        ItemSeparatorComponent={() => <View style={{ height: hp('3%') }} />}
                                    />
                                    {showArrowDown && (
                                        <TouchableOpacity onPress={toggleItems} style={{ alignSelf: 'center', paddingTop: hp('3%') }}>
                                            {isExpanded ? <ArrowUp /> : <ArrowDownIcon color={'#666'} />}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.eventsTitle}>{translate('Quick Access')}</Text>
                                <FlatList
                                    scrollEnabled={false}
                                    data={QuickAccessItems}
                                    renderItem={({ item }) => (
                                        <QuickAccessItem
                                            title={item.title}
                                            icon={item.icon}
                                            action={() => {
                                                if (item.navigation === 'ComingSoon') {
                                                    Alert.alert(`${translate('Coming Soon')}`, `${translate('This feature is coming soon')}`)
                                                    return
                                                }
                                                //@ts-ignore
                                                navigation.navigate(item.navigation)
                                            }}
                                        />
                                    )}
                                    keyExtractor={(item) => item.title}
                                    numColumns={3}
                                />
                                {/* <Pressable onPress={() => navigation.navigate(item.navigation)}>// </Pressable> */}
                            </View>
                        </ScrollView>
                    )}

                    {tabValue === 1 && (
                        <View style={{ flex: 1 }}>
                            {propertyFromWP && propertyFromWP.acf.location && (
                                <MapView
                                    style={styles.mapView}
                                    ref={mapRef}
                                    initialRegion={{
                                        latitude: propertyFromWP?.acf.location.lat,
                                        longitude: propertyFromWP?.acf.location.lng,
                                        latitudeDelta: 0.0522,
                                        longitudeDelta: 0.0221,
                                    }}
                                    showsUserLocation={true}>
                                    <Marker
                                        coordinate={{
                                            latitude: propertyFromWP?.acf.location.lat,
                                            longitude: propertyFromWP?.acf.location.lng,
                                        }}>
                                        <CustomMarkerView property={propertyFromWP} />
                                    </Marker>
                                </MapView>
                            )}
                        </View>
                    )}
                </ScrollView>
            ) : (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size='large' />
                </View>
            )}
        </>
    )
}

// const PropertyDetailsItem = ({ label, value, icon }: { label: string; value: string | null; icon: JSX.Element }) => {
//     return (
//         <View style={styles.propertyDetailsItemContainer}>
//             <View style={styles.propetyDetailsIcon}>{icon}</View>
//             <View style={styles.propertyDetailsItem}>
//                 <Text
//                     style={{
//                         fontSize: wp("3.75%"),
//                         color: "#666666",
//                         fontFamily: "regular",
//                     }}
//                 >
//                     {label}
//                 </Text>
//                 <Text
//                     style={{
//                         fontSize: wp("3.75%"),
//                         color: "black",
//                         fontFamily: "regular",
//                     }}
//                 >
//                     {value}
//                 </Text>
//             </View>
//         </View>
//     )
// }

// const EventAndNewsItem = ({ eventAndNews }: { eventAndNews: EventAndNewsInterface }) => {
//     return (
//         <View style={styles.eventAndNewsItemContainer}>
//             <Image source={require("../../../assets/images/event.png")} style={styles.eventAndNewsItemImage} />
//             <View style={styles.eventAndNewsDescription}>
//                 <View style={styles.eventAndNewsTitle}>
//                     <View style={styles.eventAndNewsType}>
//                         <Text style={styles.eventAndNewsTypeText}>{eventAndNews.type}</Text>
//                     </View>
//                     <View style={styles.eventAndNewsDateContainer}>
//                         <Text style={styles.eventAndNewsDate}>{eventAndNews.date}</Text>
//                     </View>
//                 </View>
//                 <Text style={styles.eventAndNewsTitleText}>Discover the 10 best places in your neighbored.</Text>
//                 {eventAndNews.type === "Event" && (
//                     <View style={styles.eventDetailsContainer}>
//                         <EventDetails value={eventAndNews.date!} icon={<SmallCalendarIcon />} />
//                         <EventDetails value={eventAndNews.hours!} icon={<ClockIcon />} />
//                         <EventDetails value={eventAndNews.location!} icon={<LocationIcon />} />
//                     </View>
//                 )}
//                 <Text style={styles.eventAndNewsDiscover}>{eventAndNews.type === "Event" ? "Discover" : "Read article"}</Text>
//             </View>
//         </View>
//     )
// }

const EventDetails = ({ value, icon }: { value: string; icon: JSX.Element }) => {
    return (
        <View style={styles.eventDetails}>
            {icon}
            <Text style={styles.eventDetailsText}>{value}</Text>
        </View>
    )
}

const QuickAccessItem = ({ icon, title, action }: { icon: JSX.Element; title: string; action: () => void }) => {
    return (
        <Pressable style={styles.quickAccessItemContainer} onPress={action}>
            {icon}
            <Text style={styles.quickAccessTitle}>{title}</Text>
        </Pressable>
    )
}

// const ProjectUpdateItem = ({ item, action }: { item: ProjectUpdateItemInterface; action: () => void }) => {
//     return (
//         <Pressable style={styles.projectUpdateContainer} onPress={action}>
//             <Image source={item.image} resizeMode="cover" />
//             <View style={styles.projectDescriptionContainer}>
//                 <View style={styles.projectDateContainer}>
//                     <Text style={styles.projectDate}>{item.date}</Text>
//                 </View>

//                 <Text style={styles.projectTitle}>{item.title}</Text>
//             </View>
//         </Pressable>
//     )
// }

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    image: {
        width: wp('100%'),
    },
    backArrowContainer: {
        position: 'absolute',
        top: hp('5%'),
        left: wp('7.5%'),
        zIndex: 1,
        backgroundColor: 'white',
        height: 40,
        width: 40,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: wp('90%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
    },
    locationWrapper: {
        marginTop: hp('0.5%'),
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: wp('3.75%'),
        color: '#666666',
        fontFamily: 'regular',
        marginLeft: wp('1%'),
    },
    statusWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        paddingTop: hp('1'),
        paddingBottom: hp('1'),

        paddingHorizontal: wp('2%'),
        width: wp('40%'), // Set a specific width or use 'auto'
    },
    status: {
        textAlign: 'center',
        fontSize: wp('3.75%'),
        fontFamily: 'medium',
        maxWidth: '100%', // Ensure the text doesn't exceed the parent's width
    },
    name: {
        marginTop: hp('0.5%'),
        /* marginLeft: wp("5%"), */
        fontSize: wp('5.5%'),
        fontFamily: 'regular',
        alignSelf: 'flex-start',
    },
    description: {
        /* marginLeft: wp("5%"), */
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        alignSelf: 'flex-start',
    },
    separator: {
        width: wp('92.5%'),
        alignSelf: 'center',
        height: 1,
        backgroundColor: '#000',
        opacity: 0.05,
        marginVertical: hp('2.25%'),
    },
    customerNumberLabel: {
        fontSize: wp('4%'),
        fontFamily: 'regular',
        marginLeft: wp('5%'),
        color: '#666666',
        alignSelf: 'flex-start',
    },
    customerNumber: {
        fontSize: wp('3.75%'),
        fontFamily: 'regular',
        color: 'black',
        marginLeft: wp('5%'),
        alignSelf: 'flex-start',
        // marginTop: hp('0.5%'),
    },
    propertyDetailsContainer: {
        justifyContent: 'space-around',
        alignItems: 'center',
        width: wp('90%'),
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingVertical: hp('2%'),
        marginTop: hp('2%'),
        paddingHorizontal: wp('5%'),
        marginBottom: hp('2%'),
    },
    propertyDetailsWrapper: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: wp('80%'),
        alignSelf: 'center',

        marginRight: wp('1%'),
    },

    propertyDetailsItemContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
    },
    propertyDetailsItem: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('0.2%'),
    },
    propetyDetailsIcon: {
        padding: 10,
        backgroundColor: '#F9F6F5',
        borderRadius: 50,
    },
    eventsTitle: {
        fontSize: wp('4.5%'),
        color: 'black',
        marginTop: hp('3.5%'),
        marginBottom: hp('1.5%'),
        fontFamily: 'regular',
        alignSelf: 'flex-start',
    },
    eventAndNewsItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp('90%'),
        alignSelf: 'center',
        borderRadius: 10,
        padding: 10,
    },
    eventAndNewsItemImage: {
        width: wp('25%'),
        height: hp('13%'),
        borderRadius: 10,
    },
    eventAndNewsDescription: {
        width: wp('60%'),
        marginLeft: wp('3.5%'),
    },
    eventAndNewsTitle: {
        flexDirection: 'row',
    },
    eventAndNewsType: {
        backgroundColor: '#85553A',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    eventAndNewsDateContainer: {
        marginLeft: wp('2%'),
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#707070',
    },
    eventAndNewsTypeText: {
        color: 'white',
        fontSize: wp('3.5%'),
        fontFamily: 'medium',
    },
    eventAndNewsDate: {
        color: 'black',
        fontSize: wp('3.5%'),
        fontFamily: 'medium',
    },
    eventAndNewsTitleText: {
        color: 'black',
        fontSize: wp('4.5%'),
        fontFamily: 'bold',
        marginTop: hp('2.5%'),
    },
    eventAndNewsLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1.5%'),
    },
    eventAndNewsLocation: {
        color: '#85553A',
        fontSize: 14,
        fontWeight: 'bold',
    },
    eventAndNewsDiscover: {
        color: '#85553A',
        fontSize: wp('3.75%'),
        fontFamily: 'medium',
        textDecorationLine: 'underline',
        marginTop: hp('1.5%'),
    },
    eventDetailsContainer: {
        marginTop: hp('1%'),
    },
    eventDetails: {
        flexDirection: 'row',
        marginTop: hp('0.5%'),
        alignItems: 'center',
    },
    eventDetailsText: {
        fontSize: wp('3.75%'),
        fontFamily: 'medium',
        marginLeft: wp('1%'),
        color: '#666666',
    },
    eventSeparator: {
        width: wp('92.5%'),
        alignSelf: 'center',
        height: 1,
        backgroundColor: '#F4F4F4',
        marginVertical: hp('2.25%'),
    },
    eventFlatList: {
        marginTop: hp('2%'),
        backgroundColor: '#fcfcfc',
        paddingBottom: hp('12.5%'),
    },
    viewAllButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000000',
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('2%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('90%'),
        marginVertical: hp('3%'),
    },
    viewAllButtonText: {
        color: 'black',
        fontSize: wp('4.25%'),
        fontFamily: 'medium',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: wp('100%'),
        backgroundColor: 'white',
        paddingVertical: hp('1.75%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
        margin: 5,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'medium',
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    mapView: {
        height: hp('60%'),
        width: wp('100%'),
    },
    markerCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#85563aa7',
        borderColor: '#85563ae2',
        borderWidth: 2,
    },
    section: {
        backgroundColor: '#fff',
        // marginTop: hp('1%'),
        paddingBottom: hp('0.5%'),
        width: wp('100%'),
        paddingHorizontal: wp('5%'),
        alignSelf: 'center',
        marginBottom: hp('5%'),
    },
    quickAccessTitle: {
        fontSize: wp('4%'),
        color: 'black',
        marginTop: hp('1%'),
        fontFamily: 'regular',
    },
    quickAccessItemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#FCF0F0',
        marginHorizontal: wp('1%'),
        marginVertical: hp('1%'),
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('2%'),
    },
    projectUpdateContainer: {
        flexDirection: 'row',
        width: wp('90%'),
        height: hp('9.5%'),
    },
    projectDescriptionContainer: {
        paddingLeft: wp('3.5%'),
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    projectTitle: {
        fontSize: wp('5.5%'),
        fontFamily: 'regular',
        color: '#121212',
        maxWidth: wp('60%'),
        // backgroundColor: 'red'
    },
    projectDateContainer: {
        padding: wp('1.25%'),
        borderWidth: 0.3,
        borderColor: '#666666',
    },
    projectDate: {
        fontSize: wp('5%'),
        fontFamily: 'medium',
        color: '#666666',
    },
    projectImage: {},
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    liveConstructionContainer: {
        position: 'absolute',
        top: hp('6%'),
        right: wp('7.5%'),
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'black',
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('1%'),
        borderRadius: 10,
    },
    liveConstructionText: {
        color: 'white',
        fontSize: wp('3.5%'),
        fontFamily: 'medium',
        marginLeft: wp('2%'),
    },
    marker: {
        backgroundColor: 'black',
        padding: 5,
        borderRadius: 5,
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.5%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    rectangle: {
        width: wp('2.5%'),
        height: wp('2.5%'),
        backgroundColor: 'black',
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        alignSelf: 'center',
        top: hp('4.5%'),
        borderRadius: 3,
    },
    markerText: {
        color: 'white',
        fontFamily: 'bold',
        fontSize: wp('3.75%'),
    },
})
