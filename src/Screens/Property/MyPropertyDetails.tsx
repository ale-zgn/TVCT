import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ArrowLeftIcon, RightArrowIcon } from '../../../assets/svgs/Svg'
import { useTranslation } from '../../Services/hooks/useTranslation'

import { Image } from 'expo-image'
import { carsData } from '../Home/HomeScreen'

export default function MyPropertyDetails() {
    const [propertyFromWP, setPropertyFromWP] = useState<WPProperty | null>(null)

    const navigation = useNavigation()
    const { translate, language } = useTranslation()
    const mapRef = useRef<MapView>(null)

    const route = useRoute()
    //const { property_id } = route.params as { property_id: number }
    //const { data: property, isFetching: propretyIsFetching, refetch } = useGetUserPropertyQuery(property_id)
    const property = carsData[0]

    return (
        <ScrollView
            style={styles.wrapper}
            contentContainerStyle={{
                alignItems: 'center',

                flex: 1,
            }}>
            <Pressable style={styles.backArrowContainer} onPress={() => navigation.goBack()}>
                {language === 'en' ? <ArrowLeftIcon /> : <RightArrowIcon />}
            </Pressable>

            <Image
                placeholder={{
                    blurhash:
                        '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[',
                }}
                source={property.image}
                style={{ width: '100%', height: hp('35%'), marginBottom: hp('2%') }}
            />
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: wp('4%') }}>
                <View>
                    <Text style={styles.propertyName}>{property?.name}</Text>
                    <View style={styles.propertyLocationWrapper}>
                        <Text style={styles.propertyLocation}>{property.genre}</Text>
                    </View>
                    <View style={styles.propertyLocationWrapper}>
                        <Text style={styles.propertyLocation}>{property.transmission}</Text>
                    </View>
                </View>
                <View style={styles.statusWrapper}>
                    <Text style={styles.status}>{property.activity}</Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fcfcfc',
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

    propertyName: {
        fontSize: wp('7%'),
        fontFamily: 'regular',
        color: 'black',
        alignSelf: 'flex-start',
    },
    propertyLocation: {
        fontSize: wp('5.5%'),
        fontFamily: 'regular',
        color: 'black',
        paddingTop: hp('0.5%'),
    },

    propertyDetails: {
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        color: 'black',
    },
    propertyLocationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,

        backgroundColor: '#707070',
        borderColor: '#FFFFFF',
        paddingVertical: hp('0.5%'),
        paddingHorizontal: wp('2%'),
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
})
