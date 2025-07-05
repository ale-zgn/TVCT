import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ArrowLeftIcon, LeftArrowIcon, RightArrowIcon } from '../../../assets/svgs/Svg'
import { useTranslation } from '../../Services/hooks/useTranslation'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import MaintButton from 'src/Components/Shared/MaintButton'
import Title from 'src/Components/Shared/Title'
import { useGetCarQuery } from 'src/Services/API'
import { carsData } from '../Home/HomeScreen'
export default function MyPropertyDetails() {
    const navigation = useNavigation()
    const { translate, language } = useTranslation()
    const mapRef = useRef<MapView>(null)

    const route = useRoute()
    const { car_id } = route.params as { car_id: number }
    const { data: car, isFetching: propretyIsFetching, refetch } = useGetCarQuery(car_id)
    const property = carsData[0]
    const vehicleSections = [
        {
            sectionTitle: 'Vehicle Information',
            fields: [
                { name: 'matricule', label: 'License Plate Number' },
                { name: 'genre', label: 'Category' },
                { name: 'type', label: 'Vehicle Type' },
                { name: 'construteur', label: 'Manufacturer' },
                { name: 'serie', label: 'Type Serial Number' },
                { name: 'typemoteur', label: 'Engine Type' },
                { name: 'dpmc', label: 'First Registration Date (DPMC)' },
            ],
        },
        {
            sectionTitle: 'Specifications',
            fields: [
                { name: 'place', label: 'Number of Seats' },
                { name: 'porte', label: 'Number of Doors' },
                { name: 'inscrit', label: 'Registration Date' },
            ],
        },
        {
            sectionTitle: 'Owner',
            fields: [
                { name: 'nom', label: 'Full Name' },
                { name: 'adresse', label: 'Address' },
                { name: 'cin', label: 'National ID (CIN)' },
            ],
        },
        {
            sectionTitle: 'Commercial',
            fields: [{ name: 'commercial', label: 'Commercial Type' }],
        },
    ]

    return (
        <>
            <ScrollView
                style={styles.wrapper}
                contentContainerStyle={{
                    alignItems: 'center',

                    paddingBottom: hp('10%'),
                }}
                scrollEnabled>
                <Pressable style={styles.backArrowContainer} onPress={() => navigation.goBack()}>
                    {language === 'en' ? <ArrowLeftIcon /> : <RightArrowIcon />}
                </Pressable>

                <View style={{ width: '100%', height: hp('35%'), marginBottom: hp('2%') }}>
                    <Image
                        placeholder={{
                            blurhash: '|rF?hV%2WCj[ayj[...etc',
                        }}
                        source={property.image}
                        style={{ width: '100%', height: '100%' }}
                    />

                    <Pressable
                        onPress={() => {}}
                        style={{
                            position: 'absolute',
                            top: hp('5%'),
                            right: wp('7.5%'),
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            padding: 10,
                            borderRadius: 30,
                        }}>
                        <MaterialCommunityIcons name='trash-can-outline' size={24} color='black' />
                    </Pressable>
                </View>

                {vehicleSections.map((section, index) => (
                    <BlurView
                        intensity={10}
                        tint='dark'
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '90%',
                            margin: hp('0.5%'),
                            padding: hp('2%'),
                            borderRadius: 16,
                            overflow: 'hidden',
                        }}>
                        <View
                            key={index}
                            style={{
                                width: '100%',
                                marginVertical: hp('1%'),
                            }}>
                            <Text
                                style={{
                                    fontSize: wp('4.5%'),
                                    fontWeight: 'bold',
                                    marginBottom: hp('1%'),
                                    color: '#000',
                                }}>
                                {section.sectionTitle}
                            </Text>

                            {section.fields.map((field, fieldIndex) => (
                                <View
                                    key={fieldIndex}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: hp('1%'),
                                    }}>
                                    <Text style={{ fontSize: wp('3.75%'), color: '#333' }}>{field.label}</Text>
                                    <Text
                                        style={{
                                            fontSize: wp('3.25%'),
                                            color: '#000',
                                        }}>
                                        {car?.[field.name] ?? '—'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </BlurView>
                ))}

                <Title value={translate('My visits')} />

                {car?.reservations?.length > 0 ? (
                    car?.reservations.map((reservation, index) => (
                        <BlurView
                            key={reservation.id || index}
                            intensity={10}
                            tint='dark'
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '90%',
                                marginVertical: hp('0.5%'),
                                padding: hp('2%'),
                                borderRadius: 16,
                                overflow: 'hidden',
                            }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: wp('4.2%'),
                                        marginBottom: hp('1%'),
                                        fontWeight: 'bold',
                                        color: '#000',
                                    }}>
                                    {translate('Car Matricule')}: {car?.matricule}
                                </Text>
                                <Text style={{ fontSize: wp('3.8%'), color: '#444' }}>
                                    {translate('Visit at')} {reservation.center?.longitude || 'Center'} -{' '}
                                    {new Date(reservation.date).toLocaleTimeString(language === 'en' ? 'en-US' : 'fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                            {language === 'en' ? <RightArrowIcon color='#000' /> : <LeftArrowIcon color='#000' />}
                        </BlurView>
                    ))
                ) : (
                    <Text style={{ fontSize: wp('3.8%'), color: '#444' }}>{translate('You have no reservations')}</Text>
                )}
            </ScrollView>
            <MaintButton
                title={translate('Create a visit')}
                backgroundColor='black'
                textColor='white'
                textFontFamily='semiBold'
                textFontSize={wp('5%')}
                style={{
                    borderWidth: 0,

                    borderColor: '#452C21',
                    height: hp('8%'),
                    marginBottom: hp('5%'),
                }}
                defaultMargin={hp('0.25%')}
                action={() => {
                    //@ts-ignore
                    navigation.navigate('NewVisitScreen', { car_id: car_id })
                }}
            />
        </>
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
    flatList: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
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
