import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import React, { ComponentType, JSX, useEffect } from 'react'
import { Dimensions, FlatList, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import {
    CarIcon,
    CheckShieldIcon,
    ContactIcon,
    FamilyCarIcon,
    FAQIcon,
    LeftArrowIcon,
    MinibusCarIcon,
    PickupCarIcon,
    PossibilitiesIcon,
    PrivacyPolicyIcon,
    RightArrowIcon,
    ServicesIcon,
    SuvCarIcon,
    UtilityCarIcon,
} from '../../../assets/svgs/Svg'
import Title from '../../Components/Shared/Title'
import useSearchBar from '../../Components/Shared/useSearchBar'

import { useTranslation } from '../../Services/hooks/useTranslation'

import 'moment/locale/ar'

import { getItemAsync } from 'expo-secure-store'

import { ImageBackground } from 'expo-image'
import { socketAuth } from '../../Services/Socket'

import { decodeToken } from 'react-jwt'

import * as SecureStore from 'expo-secure-store'

import { BlurView } from 'expo-blur'
import { API, useGetCarsQuery } from 'src/Services/API'
import { Car } from 'src/Services/Interface'
import { store } from '../../Store/store'

interface ServiceInterface {
    name: string
    backgroundColor: string
    icon: JSX.Element
    onPress: () => void
}

const carsTypes: {
    name: string
    icon: ComponentType<{ color?: string }>
}[] = [
    { name: 'Voitures', icon: CarIcon },
    { name: 'SUV', icon: SuvCarIcon },
    { name: 'Familiales', icon: FamilyCarIcon },
    { name: 'Pick-ups', icon: PickupCarIcon },
    { name: 'Minibus', icon: MinibusCarIcon },
    { name: 'Utilitaires', icon: UtilityCarIcon },
]

const DriveInformations: {
    title: string
    content: string
    icon: ComponentType<{ color?: string }>
}[] = [
    {
        title: 'We’ve Got You Covered',
        content:
            'Rest easy knowing that every vehicle undergoes thorough technical inspection, and our support team is always within reach for assistance or guidance.',
        icon: ServicesIcon,
    },
    {
        title: 'Endless Possibilities',
        content: 'Access detailed reports, set reminders, and book inspection appointments — all in one place, wherever you are.',
        icon: PossibilitiesIcon,
    },
    {
        title: 'Drive with Confidence',
        content: 'Ensure your vehicle meets all safety and legal standards with certified inspections, helping you stay compliant and safe on the road.',
        icon: CheckShieldIcon,
    },
]

export const carsData: {
    name: string
    genre: string
    activity: string
    image: string
    fuelType: string
    transmission: string
    seatingCapacity: number
    pricePerDay: number
    features: string[]
}[] = [
    {
        name: 'Toyota RAV4',
        genre: 'SUV',
        activity: 'Family trips, off-road adventures',
        image: require('../../../assets/images/exampleCar.jpg'),
        fuelType: 'Hybrid',
        transmission: 'Automatic',
        seatingCapacity: 5,
        pricePerDay: 70,
        features: ['All-Wheel Drive', 'Adaptive Cruise Control', 'Bluetooth'],
    },
    {
        name: 'Honda Civic',
        genre: 'Sedan',
        activity: 'City driving, commuting',
        image: require('../../../assets/images/exampleCar2.jpg'),
        fuelType: 'Petrol',
        transmission: 'Manual',
        seatingCapacity: 5,
        pricePerDay: 50,
        features: ['Eco Mode', 'Lane Assist', 'Rear Camera'],
    },
    {
        name: 'Jeep Wrangler',
        genre: 'Off-Road',
        activity: 'Adventure, rugged terrain',
        image: require('../../../assets/images/exampleCar3.jpg'),
        fuelType: 'Diesel',
        transmission: 'Automatic',
        seatingCapacity: 4,
        pricePerDay: 90,
        features: ['4x4 Drive', 'Removable Roof', 'Hill Descent Control'],
    },
]

export default function HomeScreen() {
    const { translate, language: selectedLanguage } = useTranslation()
    const { searchBar, value } = useSearchBar({
        placeholder: 'Search a property',
        withPadding: true,
    })
    const { data: cars } = useGetCarsQuery({})
    const baseOptions = {
        vertical: false,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 0.675,
    }

    const navigation = useNavigation()
    //console.log(surveys)

    useEffect(() => {
        if (value.length > 0) {
            //@ts-ignore
            navigation.navigate('SearchStack')
        }
    }, [value])

    useEffect(() => {
        getItemAsync('token').then(async (token) => {
            if (token) {
                try {
                    let decoded = decodeToken(token)

                    //@ts-ignore
                    if (decoded && decoded.iat && decoded.user_id && moment(decoded.iat * 1000).isBefore(moment('2024-05-05')) && decoded.user_id == 902) {
                        await SecureStore.deleteItemAsync('token')
                        store.dispatch(API.util.resetApiState())
                        Toast.show({
                            title: translate('You have been logged out'),
                            type: ALERT_TYPE.SUCCESS,
                        })
                        //@ts-ignore
                        navigation.replace('TabNavigatorUnlogged')
                    }
                } catch (e) {
                    console.log(e)
                }

                socketAuth(token)
            }
        })
    }, [])

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle='dark-content' />
            <SafeAreaView style={{ marginBottom: hp('5.75%') }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp('10%') }}>
                    <Title
                        value={translate('Quick Access')}
                        viewAll
                        action={() => {
                            //@ts-ignore
                            navigation.navigate('ServiceStack', { screen: 'MyServices' })
                        }}
                    />
                    <FlatList<ServiceInterface>
                        contentContainerStyle={styles.flatList}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={[
                            {
                                name: translate('FAQ'),
                                icon: <FAQIcon />,
                                onPress: () => {
                                    //@ts-ignore
                                    navigation.navigate('ServiceStack')
                                    setTimeout(() => {
                                        //@ts-ignore
                                        navigation.navigate('FAQ')
                                    }, 100)
                                },
                                backgroundColor: '#FCF0FB',
                            },
                            {
                                name: translate('Privacy policy'),
                                icon: <PrivacyPolicyIcon />,
                                onPress: () => {
                                    //@ts-ignore
                                    navigation.navigate('ServiceStack')
                                    setTimeout(() => {
                                        //@ts-ignore
                                        navigation.navigate('PrivacyPolicy')
                                    }, 100)
                                },

                                backgroundColor: '#E0F7E5',
                            },
                            {
                                name: translate('Contact'),
                                onPress: () => {
                                    //@ts-ignore
                                    navigation.navigate('ServiceStack')
                                    setTimeout(() => {
                                        //@ts-ignore
                                        navigation.navigate('Contact')
                                    }, 100)
                                },

                                icon: <ContactIcon />,
                                backgroundColor: '#FFFAE8',
                            },
                        ]}
                        renderItem={({ item }) => <ServiceItem service={item} />}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                    {cars && (
                        <>
                            <Title value={translate('My cars')} />
                            <FlatList
                                contentContainerStyle={styles.flatList}
                                initialScrollIndex={0}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={cars}
                                renderItem={({ item }) => <CarItem Car={item} />}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                ListEmptyComponent={() => (
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                        }}>
                                        <Text style={{ fontSize: wp('4.5%'), fontFamily: 'regular' }}>{translate('No properties found')}</Text>
                                    </View>
                                )}
                            />
                        </>
                    )}
                    <Title value={translate('My visits')} />

                    <FlatList
                        contentContainerStyle={styles.flatList}
                        showsVerticalScrollIndicator={false}
                        data={['', '', '']} // Replace with real data later
                        renderItem={({ item }) => (
                            <BlurView
                                intensity={10}
                                tint='dark'
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    marginVertical: hp('0.5%'),
                                    padding: hp('2%'),
                                    borderRadius: 16,
                                    overflow: 'hidden', // Important for rounded corners on blur
                                }}>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: wp('4.2%'),
                                            fontWeight: 'bold',
                                            color: '#000',
                                        }}>
                                        Car Matricule ABC-123
                                    </Text>
                                    <Text style={{ fontSize: wp('3.8%'), color: '#444' }}>Visit at City Center - 10:30 AM</Text>
                                </View>
                                {selectedLanguage === 'en' ? <RightArrowIcon color='#000' /> : <LeftArrowIcon color='#000' />}
                            </BlurView>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListEmptyComponent={() => (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                }}>
                                <Text style={{ fontSize: wp('4.5%'), fontFamily: 'regular' }}>{translate('No properties found')}</Text>
                            </View>
                        )}
                    />

                    <FlatList
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        data={DriveInformations}
                        contentContainerStyle={{
                            paddingHorizontal: wp('4.5%'),
                            marginTop: wp('4.5%'),
                        }}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    columnGap: wp('4.5%'),
                                    marginVertical: wp('4.5%'),
                                }}>
                                <View>
                                    <item.icon />
                                </View>
                                <View
                                    style={{
                                        width: '90%',
                                        rowGap: 8,
                                    }}>
                                    <Text
                                        style={{
                                            color: '#0b163f', // assuming 'ultraDarkBlue'
                                            fontWeight: '600', // semiBold
                                            fontSize: 18,
                                        }}>
                                        {item.title}
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#0b163f', // assuming 'ultraDarkBlue'
                                            fontWeight: '500',
                                            fontSize: 14,
                                            lineHeight: 24,
                                        }}>
                                        {item.content}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

function ServiceItem({ service }: { service: ServiceInterface }) {
    return (
        <Pressable style={styles.serviceWrapper} onPress={service.onPress}>
            <View style={[styles.serviceIconWrapper, { borderColor: service.backgroundColor }]}>{service.icon}</View>
            <Text style={styles.serviceTitle}>{service.name}</Text>
        </Pressable>
    )
}

function CarItem({ Car }: { Car: Car }) {
    const navigation = useNavigation()
    const { translate, language } = useTranslation()

    return (
        <Pressable
            style={styles.propertyWrapper}
            onPress={() => {
                //@ts-ignore
                navigation.navigate('MyCarDetails', {
                    car_id: Car.id,
                })
            }}>
            <ImageBackground
                placeholder={{
                    blurhash:
                        '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[',
                }}
                source={require('../../../assets/images/exampleCar3.jpg')}>
                <View style={styles.propertyOverlay}>
                    <View style={styles.statusWrapper}>
                        <Text style={styles.status}>{Car?.type}</Text>
                    </View>

                    <Text style={styles.propertyName}>{Car?.construteur}</Text>

                    <View style={styles.propertyLocationWrapper}>
                        <Text style={styles.propertyLocation}>{Car?.genre}</Text>
                    </View>
                    <View style={styles.propertyLocationWrapper}>
                        <Text style={styles.propertyLocation}>{Car?.matricule}</Text>
                    </View>
                    <View style={styles.propertyDetailsWrapper}>
                        <Text style={styles.propertyDetails}>{translate('View details')}</Text>
                        {language === 'en' ? <RightArrowIcon color='#fff' /> : <LeftArrowIcon color='#fff' />}
                    </View>
                </View>
            </ImageBackground>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: wp('9%'),
        height: wp('9%'),
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 25,
        backgroundColor: 'white',
    },
    closeButtonText: {
        color: 'white',
    },
    flatList: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
    },
    separator: {
        width: wp('2%'),
    },
    insertWrapper: {
        width: wp('90%'),
        height: hp('20%'),
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp('2.5%'),
    },
    insertLeft: {
        height: '100%',
        justifyContent: 'center',
        marginLeft: wp('7.5%'),
        width: wp('50%'),
    },
    insertRight: {
        width: wp('32.5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    insertTitle: {
        fontSize: wp('4.25%'),
        fontFamily: 'bold',
        color: '#fff',
    },
    insertDescription: {
        fontSize: wp('3.75%'),
        fontFamily: 'regular',
        color: '#fff',
        marginTop: hp('1.5%'),
    },
    titleWrapper: {
        alignSelf: 'flex-start',
        marginLeft: wp('5%'),
    },
    viewAll: {
        fontSize: wp('4.5%'),
        color: '#707070',
        fontFamily: 'regular',
    },
    // propertyTypeWrapper: {
    //     paddingVertical: hp('1.5%'),
    //     paddingHorizontal: wp('5%'),
    //     borderRadius: 15,
    //     backgroundColor: 'white',
    //     borderWidth: 1,
    //     borderColor: '#F2F2F2',
    // },
    // propertyTypeTitle: {
    //     fontSize: wp('3.5%'),
    //     color: 'black',
    // },
    featuredPropertyWrapper: {
        width: wp('38.5%'),
        backgroundColor: 'white',
        alignItems: 'center',
        paddingBottom: hp('1%'),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
    },
    featuredPropertyImage: {
        width: '100%',
        height: hp('14.5%'),
    },
    heartWrapper: {
        position: 'absolute',
        top: hp('1%'),
        right: wp('1.5%'),
        opacity: 0.8,
        padding: 10,
        borderRadius: 50,
        blurRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff3d',
    },
    nameWrapper: {
        alignSelf: 'flex-start',
        marginTop: hp('1%'),
        backgroundColor: 'white',
        marginLeft: wp('2.5%'),
    },
    name: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
    },
    locationWrapper: {
        flexDirection: 'row',
        marginTop: wp('0.5%') * -1,
        alignItems: 'center',
    },
    location: {
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        color: '#666666',
        marginLeft: wp('1%'),
        paddingTop: hp('0.25%'),
    },
    units: {
        color: '#666666',
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        alignSelf: 'flex-start',
        marginLeft: wp('2.5%'),
        marginTop: hp('0.3%'),
        // marginTop: hp('1%'),
    },
    details: {
        color: '#85553A',
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        alignSelf: 'flex-start',
        marginLeft: wp('2.5%'),
        marginTop: hp('0.3%'),
    },
    newsImage: {
        width: wp('32.5%'),
        height: '100%',
        borderRadius: 7.5,
    },
    newsContentWrapper: {
        marginLeft: wp('5%'),
        width: wp('45%'),
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'space-around',
    },
    newsTitle: {
        fontSize: wp('5.5%'),
        fontFamily: 'regular',
        color: '#fff',
        marginTop: hp('2%'),
        width: wp('65%'),
        marginBottom: hp('1%'),
    },
    newsDate: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
        color: '#fff',
    },
    readMoreWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    newsSeparator: {
        height: hp('2%'),
    },
    serviceWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceIconWrapper: {
        borderWidth: 2,
        width: wp('21%'),
        height: wp('20%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceTitle: {
        fontSize: wp('4.25%'),
        fontFamily: 'medium',
        marginTop: hp('1.5%'),
        color: '#171717',
    },
    propertyWrapper: {
        width: wp('90%'),
        height: hp('41%'),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    propertyImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    propertyOverlay: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    propertyName: {
        fontSize: wp('7%'),
        fontFamily: 'regular',
        color: 'white',
        marginLeft: wp('5%'),
        alignSelf: 'flex-start',
    },
    propertyLocation: {
        fontSize: wp('5.5%'),
        fontFamily: 'regular',
        color: 'white',
        marginLeft: wp('1%'),
        paddingTop: hp('0.5%'),
    },
    propertyDetailsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp('2.5%'),
        marginTop: hp('1.5%'),
        width: wp('90%'),
        paddingHorizontal: wp('5%'),
    },
    propertyDetails: {
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        color: 'white',
    },
    propertyLocationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('5%'),
    },
    statusWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#707070',
        borderColor: '#FFFFFF',
        paddingVertical: hp('0.5%'),
        paddingHorizontal: wp('2%'),
        position: 'absolute',
        top: 15,
        right: 15,
    },
    status: {
        fontSize: wp('4.5%'),
        color: '#FFFFFF',
        fontFamily: 'medium',
    },
    step: {
        height: 7.5,
        borderRadius: 5,
        marginHorizontal: 2.5,
    },
    stepsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 50,
    },
    newsWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.60)',
        width: wp('100%'),
        height: hp('35%'),
        paddingBottom: hp('3.5%'),
        paddingLeft: wp('5%'),
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    newsCategoryContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: '#85553A',
        borderColor: '#99705A',
        borderWidth: 2,
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1%'),
    },
    newsCategory: {
        fontSize: wp('5%'),
        fontFamily: 'medium',
        color: '#fff',
    },
})
