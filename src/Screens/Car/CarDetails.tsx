import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ArrowLeftIcon, RightArrowIcon } from '../../../assets/svgs/Svg'
import { useTranslation } from '../../Services/hooks/useTranslation'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import moment from 'moment'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import MaintButton from 'src/Components/Shared/MaintButton'
import Title from 'src/Components/Shared/Title'
import { useGetCarQuery, useLazyGetCenterAvailibilityQuery, useUpdateReservationMutation } from 'src/Services/API'
import useSocket from 'src/Services/hooks/useSocket'
import { Reservation, ReservationStatus } from 'src/Services/Interface'

const getNextWeekday = (date) => {
    const day = date.getDay()
    const daysToAdd = day === 0 ? 1 : day === 6 ? 2 : 0 // Sunday = 0, Saturday = 6
    const nextWeekday = new Date(date)
    nextWeekday.setDate(date.getDate() + daysToAdd)
    return nextWeekday
}
export default function MyPropertyDetails() {
    const navigation = useNavigation()
    const { translate, language } = useTranslation()
    const mapRef = useRef<MapView>(null)

    const route = useRoute()
    const { car_id } = route.params as { car_id: number }
    const { data: car, isFetching, refetch } = useGetCarQuery(car_id)
    const [dateVisible, setDateVisible] = useState(false)
    const [selectedVisit, setSelectedVisit] = useState<Reservation>()

    const [updateReservation, updateReservationMutation] = useUpdateReservationMutation()
    const [selectedDate, setSelectedDate] = useState(() => getNextWeekday(new Date()))
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [getAvailibility] = useLazyGetCenterAvailibilityQuery()
    const [availibility, setAvailibility] = useState()

    useSocket({
        onReactive: async (event) => {
            if (event.model === 'Reservation') {
                refetch()
            }
        },
    })
    useEffect(() => {
        refetch()
    }, [])
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

    const onDateChange = (event, date) => {
        if (event.type === 'set' && date) {
            const dayOfWeek = date.getDay()

            // Check if selected date is weekend (Saturday = 6, Sunday = 0)
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                // Get next weekday
                const nextWeekday = getNextWeekday(date)
                setSelectedDate(nextWeekday)
            } else {
                setSelectedDate(date)
            }
        }
        setShowDatePicker(false)
    }

    useEffect(() => {
        if (!selectedVisit) return

        getAvailibility({ id: selectedVisit.center_id, date: moment(selectedDate).locale('en').format('YYYY-MM-DD') })
            .unwrap()
            .then((data) => {
                setAvailibility(data)
            })
            .catch((error) => {
                console.error('Failed to fetch car:', error)
            })
    }, [selectedVisit, selectedDate])

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot.hour)
    }

    const handleConfirm = async () => {
        if (!selectedVisit) return
        try {
            await updateReservation({
                car_id: selectedVisit?.car_id,
                id: selectedVisit?.id,
                date: `${selectedDate.toISOString().split('T')[0]}T${selectedTimeSlot}:00`,
            }).then((res) => {
                if (!res.error) {
                    refetch()
                    setDateVisible(false)

                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: translate('Reservation updated successfully'),
                    })
                }
            })
        } catch (error: any) {
            console.error(error)
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: translate('Failed to update reservation'),
            })
        }
    }

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
                        source={require('../../../assets/images/exampleCar.jpg')}
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
                                    fontSize: wp('4%'),
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
                                    <Text style={{ fontSize: wp('3.5%'), color: '#333' }}>{field.label}</Text>
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
                        <>
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
                                            fontSize: wp('4%'),
                                            fontWeight: '500',
                                            color: '#000',
                                            marginBottom: hp('1%'),
                                        }}>
                                        {translate('Car Matricule')}: {car?.matricule}{' '}
                                        {reservation.status === ReservationStatus.PENDING && (
                                            <Text style={{ fontSize: wp('3.5%'), color: '#444' }}>(pending)</Text>
                                        )}
                                    </Text>
                                    <Text style={{ fontSize: wp('3.5%'), color: '#444' }}>
                                        {translate('Visit at')} {reservation.center.name} - {moment(reservation.date).locale('en').format('DD MMM YYYY HH:mm')}
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => {
                                        setDateVisible(true)
                                        setSelectedVisit(reservation)
                                    }}>
                                    <MaterialCommunityIcons name='pencil-outline' size={24} color='black' />
                                </Pressable>
                            </BlurView>
                            <Image source={{ uri: `data:image/png;base64,${reservation.code}` }} style={{ marginTop: hp('3%'), width: 200, height: 200 }} />
                        </>
                    ))
                ) : (
                    <Text style={{ fontSize: wp('3.8%'), color: '#444' }}>{translate('You have no reservations')}</Text>
                )}
            </ScrollView>
            {(car?.reservations.length === 0 || !car?.reservations) && (
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
            )}

            <Modal
                animationType='slide'
                transparent={true}
                visible={dateVisible}
                onRequestClose={() => {
                    setDateVisible(false)
                }}>
                <Pressable onPress={() => setDateVisible(false)} style={styles.modalView}>
                    <View
                        onStartShouldSetResponder={() => true}
                        style={{
                            height: hp('60%'),
                            backgroundColor: 'white',
                            width: '100%',
                            position: 'absolute',
                            bottom: 0,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                            paddingBottom: 0,
                            zIndex: 10,
                        }}>
                        {/* Header */}
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginBottom: 20,
                                color: '#333',
                            }}>
                            Select Date & Time
                        </Text>

                        {/* Date Selection */}
                        <View style={{ marginBottom: 20 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    marginBottom: 10,
                                    color: '#333',
                                }}>
                                Select Date
                            </Text>
                            <Pressable
                                style={{
                                    backgroundColor: '#f0f0f0',
                                    padding: 15,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setShowDatePicker(true)
                                }}>
                                <Text style={{ fontSize: 16, color: '#333' }}>{selectedDate.toDateString()}</Text>
                            </Pressable>
                        </View>

                        {showDatePicker && (
                            <DateTimePicker value={selectedDate} mode='date' display='default' onChange={onDateChange} minimumDate={new Date()} />
                        )}

                        {/* Time Slots */}
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    marginTop: hp('2%'),
                                    marginBottom: 10,
                                    color: '#333',
                                }}>
                                Available Time Slots
                            </Text>
                            <ScrollView style={{ maxHeight: hp('27%') }} showsVerticalScrollIndicator={false}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                    }}>
                                    {availibility?.map((slot) => (
                                        <Pressable
                                            key={`${slot.date}-${slot.hour}`}
                                            style={[
                                                {
                                                    width: '48%',
                                                    backgroundColor: selectedTimeSlot === slot.hour ? '#85553A' : '#fff',
                                                    padding: 12,
                                                    borderRadius: 8,
                                                    marginBottom: 10,
                                                    alignItems: 'center',
                                                    borderWidth: 1,
                                                    borderColor: selectedTimeSlot === slot.hour ? '#85553A' : '#e0e0e0',
                                                },
                                            ]}
                                            onPress={() => handleTimeSlotSelect(slot)}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: selectedTimeSlot === slot.hour ? 'white' : '#333',
                                                    fontWeight: selectedTimeSlot === slot.hour ? '600' : 'normal',
                                                }}>
                                                {slot.hour}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Action Buttons */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: hp('2%'),
                            }}>
                            <Pressable
                                style={{
                                    flex: 1,
                                    backgroundColor: '#f0f0f0',
                                    padding: 15,
                                    borderRadius: 10,
                                    marginRight: 10,
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setDateVisible(false)
                                }}>
                                <Text style={{ fontSize: 16, color: '#666' }}>Cancel</Text>
                            </Pressable>

                            <Pressable
                                style={{
                                    flex: 1,
                                    backgroundColor: selectedTimeSlot ? 'black' : '#ccc',
                                    padding: 15,
                                    borderRadius: 10,
                                    marginLeft: 10,
                                    alignItems: 'center',
                                }}
                                onPress={handleConfirm}
                                disabled={!selectedTimeSlot}>
                                {updateReservationMutation.isLoading ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: selectedTimeSlot ? 'white' : '#888',
                                            fontWeight: '600',
                                        }}>
                                        Confirm
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
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

    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
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
