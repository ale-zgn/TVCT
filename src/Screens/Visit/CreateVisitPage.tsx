import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MapView, { Marker } from 'react-native-maps'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ArrowDownIcon, PlusIcon } from '../../../assets/svgs/Svg'
import Input from '../../Components/Shared/Input'
import MaintButton from '../../Components/Shared/MaintButton'
import Picker from '../../Components/Shared/Picker'
import useOcrImagePicker from '../../Services/hooks/useOcr'
import { useTranslation } from '../../Services/hooks/useTranslation'

export default function CreateVisitPage() {
    const { translate } = useTranslation()
    const mapRef = useRef<MapView>(null)

    const [scanVisible, setScanVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [dateVisible, setDateVisible] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'online' | 'on_place' | null>(null)

    const [paymentVisible, setPaymentVisible] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm()
    const { firstImage, secondImage, chooseImageSource, processImages } = useOcrImagePicker()
    const [pickerValue, setPickerValue] = useState()
    const applyOcrResult = (dataFromApi) => {
        Object.entries(dataFromApi).forEach(([name, value]) => {
            if (value !== undefined && value !== null) {
                setValue(name, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
            }
        })
    }

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: 35.8256,
                    longitude: 10.6084,
                    latitudeDelta: 0.2044,
                    longitudeDelta: 0.0842,
                },
                900
            )
        }
    }, [mapRef])
    const conditionalFields = {
        TU: [
            { name: 'serie', label: 'Serial Number' },
            { name: 'conf_serie', label: 'Confirm Serial Number' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        RS: [
            { name: 'rs', label: 'RS' },
            { name: 'conf_rs', label: 'Confirm RS' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        MOTO: [
            { name: 'moto', label: 'Motorcycle' },
            { name: 'conf_moto', label: 'Confirm Motorcycle' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        TRAC: [
            { name: 'trac', label: 'Tractor' },
            { name: 'conf_trac', label: 'Confirm Tractor' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        PAT: [
            { name: 'pat', label: 'PAT (م أ ف)' },
            { name: 'conf_pat', label: 'Confirm PAT (م أ ف)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        CMD: [
            { name: 'cmd', label: 'CMD (ر ب د)' },
            { name: 'conf_cmd', label: 'Confirm CMD (ر ب د)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        CD: [
            { name: 'cd', label: 'CD (س د)' },
            { name: 'conf_cd', label: 'Confirm CD (س د)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        MD: [
            { name: 'md', label: 'MD (ب د)' },
            { name: 'conf_md', label: 'Confirm MD (ب د)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        MC: [
            { name: 'mc', label: 'MC (ث ق)' },
            { name: 'conf_mc', label: 'Confirm MC (ث ق)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        CC: [
            { name: 'cc', label: 'CC (س ق)' },
            { name: 'conf_cc', label: 'Confirm CC (س ق)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        REM: [
            { name: 'rem', label: 'REM (ع م)' },
            { name: 'conf_rem', label: 'Confirm REM (ع م)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        AA: [
            { name: 'aa', label: 'AA (أ ف)' },
            { name: 'conf_aa', label: 'Confirm AA (أ ف)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        ES: [
            { name: 'es', label: 'ES (م خ)' },
            { name: 'conf_es', label: 'Confirm ES (م خ)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        PE: [
            { name: 'pe', label: 'PE' },
            { name: 'conf_pe', label: 'Confirm PE' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        IT: [
            { name: 'it', label: 'IT (ت م)' },
            { name: 'conf_it', label: 'Confirm IT (ت م)' },
            { name: 'chassis', label: 'Last 5 characters of chassis number' },
        ],
        ETR: [
            { name: 'chassis', label: 'Chassis Number' },
            { name: 'conf_chassis', label: 'Confirm Chassis Number' },
        ],
    }

    const registrationTypes = [
        { label: 'Série Normale (TU)', value: 'TU' },
        { label: 'Régime Suspensif (RS)', value: 'RS' },
        { label: 'Moto (MOTO)', value: 'MOTO' },
        { label: 'Tracteur (TRAC)', value: 'TRAC' },
        { label: 'Personnel Administratif et Technique (PAT)', value: 'PAT' },
        { label: 'Chef de Mission Diplomatique (CMD)', value: 'CMD' },
        { label: 'Corps Diplomatique (CD)', value: 'CD' },
        { label: 'Mission Diplomatique (MD)', value: 'MD' },
        { label: 'Mission Consulaire (MC)', value: 'MC' },
        { label: 'Corps Consulaire (CC)', value: 'CC' },
        { label: 'Remorque (REM)', value: 'REM' },
        { label: 'Appareil Agricole (AA)', value: 'AA' },
        { label: 'Engin Spécial (ES)', value: 'ES' },
        { label: "Propriété de l'État (PE)", value: 'PE' },
        { label: 'Immatriculation Temporaire (IT)', value: 'IT' },
        { label: 'Immatriculation Étrangère ou Douanière', value: 'ETR' },
    ]

    const handleScan = async () => {
        try {
            const ocrResult = await processImages()
            applyOcrResult(ocrResult.data)
        } catch (e) {
            console.error(e)
            alert('Erreur lors du scan OCR.')
        }
    }

    const onSubmit = async (data: any) => {
        console.log('Car info submitted:', data)
        // handle API call here
    }
    const generateTimeSlots = () => {
        const slots = []
        for (let hour = 9; hour <= 17; hour++) {
            const time12h = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`
            const time24h = `${hour.toString().padStart(2, '0')}:00`
            slots.push({
                display: time12h,
                value: time24h,
                id: hour,
            })
        }
        return slots
    }

    const handleConfirmPayment = () => {
        // handle your payment logic here
        console.log('Selected Payment Method:', selectedPaymentMethod)
        setPaymentVisible(false)
    }

    const timeSlots = generateTimeSlots()

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setSelectedDate(selectedDate)
            setSelectedTimeSlot(null) // Reset time slot when date changes
        }
    }

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot)
    }

    const handleConfirm = () => {
        if (selectedTimeSlot) {
            const appointment = {
                date: selectedDate.toDateString(),
                time: selectedTimeSlot.display,
                datetime: new Date(selectedDate.toDateString() + ' ' + selectedTimeSlot.value),
            }
            console.log('Selected appointment:', appointment)
            // Handle your booking logic here
            setModalVisible(false)
            setDateVisible(false)

            setPaymentVisible(true)
        }
    }

    const fieldSections = [
        {
            sectionTitle: 'Vehicle Information',
            fields: [
                { name: 'matricule', label: 'Registration Number' },
                { name: 'genre', label: 'Category' },
                { name: 'type', label: 'Vehicle Type' },
                { name: 'construteur', label: 'Manufacturer' },
                { name: 'serie', label: 'Type Serial Number' },
                { name: 'typemoteur', label: 'Engine Type' },
                { name: 'dpmc', label: 'Date of First Registration (DPMC)' },
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
        <KeyboardAwareScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.sectionContainer}>
                    <Picker
                        title="type de la série d'immatriculation"
                        onValueChange={(value) => setPickerValue(value)}
                        items={registrationTypes}
                        placeholder={'Filter by'}
                        // @ts-ignore
                        Icon={() => {
                            return <ArrowDownIcon color='#000' />
                        }}
                    />
                    {scanVisible && (
                        <>
                            <Text style={styles.sectionTitle}>{translate('Add 2 images')}</Text>

                            <View style={[styles.inputsContainer, { justifyContent: 'flex-start', gap: 10 }]}>
                                <Pressable
                                    onPress={() => chooseImageSource('first')}
                                    style={{
                                        height: hp('20%'),
                                        width: hp('20%'),
                                        borderColor: 'black',
                                        borderWidth: 1,
                                        borderStyle: 'dashed',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    {firstImage ? (
                                        <Image
                                            source={{ uri: firstImage.uri }}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                resizeMode: 'stretch',
                                            }}
                                        />
                                    ) : (
                                        <PlusIcon />
                                    )}
                                </Pressable>
                                <Pressable
                                    onPress={() => chooseImageSource('second')}
                                    style={{
                                        height: hp('20%'),
                                        width: hp('20%'),
                                        borderColor: 'black',
                                        borderWidth: 1,
                                        borderStyle: 'dashed',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    {secondImage ? (
                                        <Image
                                            source={{ uri: secondImage.uri }}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                resizeMode: 'stretch',
                                            }}
                                        />
                                    ) : (
                                        <PlusIcon />
                                    )}
                                </Pressable>
                            </View>
                        </>
                    )}
                    {pickerValue && (
                        <>
                            <MaintButton
                                action={() => {
                                    scanVisible ? handleScan() : setScanVisible(true)
                                }}
                                title={translate(scanVisible ? 'Scan' : 'Quick scan')}
                                backgroundColor='grey'
                                textColor='white'
                            />
                            <View
                                style={{
                                    height: 1,
                                    width: wp('90%'),
                                    backgroundColor: 'grey',
                                    marginBottom: hp('2%'),
                                    alignSelf: 'center',
                                }}></View>
                            {pickerValue && conditionalFields[pickerValue] && (
                                <View>
                                    <Text style={styles.sectionTitle}>{translate('Specific information')}</Text>

                                    {conditionalFields[pickerValue].map((field) => {
                                        const isPrefixField = ['chassis'].includes(field.name)
                                        const prefixType = ['TU', 'PE', 'PAT', 'CMD', 'CD', 'MD', 'MC', 'CC'].includes(pickerValue)

                                        if (prefixType && !isPrefixField) {
                                            return (
                                                <View>
                                                    <Text style={[styles.prefixText, { marginBottom: hp('1%'), color: 'grey' }]}>{field.label}</Text>

                                                    <View style={styles.inputsContainer} key={field.name}>
                                                        <Input
                                                            name={field.name}
                                                            placeholder='XXXX'
                                                            control={control}
                                                            rules={{
                                                                required: `${translate('This field is required')}`,
                                                            }}
                                                            errors={errors}
                                                            containerStyle={{ width: wp('30%') }}
                                                        />
                                                        <View style={styles.prefixBox}>
                                                            <Text style={styles.prefixText}>{pickerValue}</Text>
                                                        </View>
                                                        <Input
                                                            name={field.name}
                                                            placeholder='XXXX'
                                                            control={control}
                                                            rules={{
                                                                required: `${translate('This field is required')}`,
                                                            }}
                                                            errors={errors}
                                                            containerStyle={{ width: wp('30%') }}
                                                        />
                                                    </View>
                                                </View>
                                            )
                                        } else {
                                            return (
                                                <View style={styles.inputsContainer} key={field.name}>
                                                    <Input
                                                        name={field.name}
                                                        title={translate(field.label)}
                                                        placeholder={''}
                                                        control={control}
                                                        rules={{
                                                            required: `${translate('This field is required')}`,
                                                        }}
                                                        errors={errors}
                                                        containerStyle={{ width: wp('90%') }}
                                                    />
                                                </View>
                                            )
                                        }
                                    })}

                                    <View
                                        style={{
                                            height: 1,
                                            width: wp('90%'),
                                            backgroundColor: 'grey',
                                            marginBottom: hp('2%'),
                                            alignSelf: 'center',
                                        }}
                                    />
                                </View>
                            )}

                            {fieldSections.map((section) => (
                                <View key={section.sectionTitle} style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>{translate(section.sectionTitle)}</Text>

                                    {section.fields.map((field) => (
                                        <View style={styles.inputsContainer} key={field.name}>
                                            <Input
                                                name={field.name}
                                                title={translate(field.label)}
                                                placeholder=''
                                                control={control}
                                                rules={{
                                                    required: `${translate('This field is required')}`,
                                                }}
                                                errors={errors}
                                                containerStyle={{ width: wp('90%') }}
                                                width={90}
                                            />
                                        </View>
                                    ))}
                                </View>
                            ))}

                            <MaintButton action={() => setModalVisible(true)} title={translate('Proceed')} backgroundColor='black' textColor='white' />
                        </>
                    )}
                </View>

                <Modal animationType='slide' transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalView}>
                        <MapView
                            style={styles.map}
                            ref={mapRef}
                            initialRegion={{
                                latitude: 35.8256,
                                longitude: 10.6084,
                                latitudeDelta: 0.2044,
                                longitudeDelta: 0.0842,
                            }}
                            showsUserLocation={true}>
                            <Marker
                                onPress={() => {
                                    setDateVisible(true)
                                }}
                                coordinate={{
                                    latitude: 35.8256,
                                    longitude: 10.6084,
                                }}></Marker>
                            <Marker
                                coordinate={{
                                    latitude: 35.4,
                                    longitude: 10.6084,
                                }}></Marker>
                        </MapView>
                        <Pressable
                            onPress={() => {
                                setModalVisible(false)
                                setDateVisible(true)
                            }}
                            style={{
                                position: 'absolute',
                                height: wp('8%'),
                                width: wp('8%'),
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                top: hp('5%'),
                                right: wp('6%'),
                                borderRadius: 50,
                            }}>
                            <Text>X</Text>
                        </Pressable>
                    </View>
                </Modal>

                <Modal animationType='slide' transparent={true} visible={dateVisible} onRequestClose={() => setDateVisible(false)}>
                    <Pressable onPress={() => setPaymentVisible(false)} style={styles.modalView}>
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
                                    onPress={() => setShowDatePicker(true)}>
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
                                        {timeSlots.map((slot) => (
                                            <Pressable
                                                key={slot.id}
                                                style={[
                                                    {
                                                        width: '48%',
                                                        backgroundColor: selectedTimeSlot?.id === slot.id ? '#85553A' : '#fff',
                                                        padding: 12,
                                                        borderRadius: 8,
                                                        marginBottom: 10,
                                                        alignItems: 'center',
                                                        borderWidth: 1,
                                                        borderColor: selectedTimeSlot?.id === slot.id ? '#85553A' : '#e0e0e0',
                                                    },
                                                ]}
                                                onPress={() => handleTimeSlotSelect(slot)}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: selectedTimeSlot?.id === slot.id ? 'white' : '#333',
                                                        fontWeight: selectedTimeSlot?.id === slot.id ? '600' : 'normal',
                                                    }}>
                                                    {slot.display}
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
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: selectedTimeSlot ? 'white' : '#888',
                                            fontWeight: '600',
                                        }}>
                                        Confirm
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                </Modal>

                <Modal animationType='slide' transparent={true} visible={paymentVisible} onRequestClose={() => setPaymentVisible(false)}>
                    <Pressable onPress={() => setPaymentVisible(false)} style={styles.modalView}>
                        <View
                            onStartShouldSetResponder={() => true}
                            style={{
                                height: hp('35%'),
                                backgroundColor: 'white',
                                width: '100%',
                                position: 'absolute',
                                bottom: 0,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                padding: 20,
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
                                Choose Payment Method
                            </Text>

                            {/* Payment Options */}
                            <View style={{ flexDirection: 'column', gap: 15 }}>
                                <Pressable
                                    style={{
                                        backgroundColor: selectedPaymentMethod === 'online' ? '#85553A' : '#f0f0f0',
                                        padding: 15,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: selectedPaymentMethod === 'online' ? '#85553A' : '#ccc',
                                    }}
                                    onPress={() => setSelectedPaymentMethod('online')}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: selectedPaymentMethod === 'online' ? 'white' : '#333',
                                            fontWeight: '600',
                                        }}>
                                        Pay Online
                                    </Text>
                                </Pressable>

                                <Pressable
                                    style={{
                                        backgroundColor: selectedPaymentMethod === 'on_place' ? '#85553A' : '#f0f0f0',
                                        padding: 15,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: selectedPaymentMethod === 'on_place' ? '#85553A' : '#ccc',
                                    }}
                                    onPress={() => setSelectedPaymentMethod('on_place')}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: selectedPaymentMethod === 'on_place' ? 'white' : '#333',
                                            fontWeight: '600',
                                        }}>
                                        Pay on Place
                                    </Text>
                                </Pressable>
                            </View>

                            {/* Action Buttons */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 30,
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
                                    onPress={() => setPaymentVisible(false)}>
                                    <Text style={{ fontSize: 16, color: '#666' }}>Cancel</Text>
                                </Pressable>

                                <Pressable
                                    style={{
                                        flex: 1,
                                        backgroundColor: selectedPaymentMethod ? 'black' : '#ccc',
                                        padding: 15,
                                        borderRadius: 10,
                                        marginLeft: 10,
                                        alignItems: 'center',
                                    }}
                                    onPress={handleConfirmPayment}
                                    disabled={!selectedPaymentMethod}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: selectedPaymentMethod ? 'white' : '#888',
                                            fontWeight: '600',
                                        }}>
                                        Confirm
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            </ScrollView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: wp('100%'),
        backgroundColor: '#fcfcfc',
        paddingBottom: hp('10%'),
    },
    title: {
        fontSize: wp('10%'),
        color: '#121212',
        fontFamily: 'regular',
        marginVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
        textAlign: 'left',
    },
    subtitle: {
        fontSize: wp('5.75'),
        color: 'black',
        marginVertical: hp('2%'),
        marginTop: hp('3%'),
        paddingHorizontal: wp('5%'),
        fontFamily: 'medium',
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90%'),
        height: hp('7.25%'),
        backgroundColor: '#F2F2F2',
        paddingHorizontal: wp('3%'),
    },
    inputLabel: {
        fontFamily: 'regular',
        fontSize: wp('5.5%'),
        color: '#121212',
        marginLeft: wp('5%'),
        marginBottom: hp('2%'),
        textAlign: 'left',
    },
    input: {
        fontSize: wp('4%'),
        color: '#121212',
        width: wp('74%'),
        height: hp('8%'),
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90%'),
        marginLeft: wp('5%'),
        marginVertical: hp('4%'),
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    separatorText: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
        color: '#121212',
        marginHorizontal: wp('5%'),
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: hp('8%'),
        width: wp('90%'),
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: '#F2F2F2',
        flexDirection: 'row',
    },
    buttonText: {
        color: 'black',
        fontSize: wp('6%'),
        fontFamily: 'medium',
        marginHorizontal: wp('5%'),
    },
    inputsContainer: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: wp('90%'),
        alignSelf: 'center',
        marginBottom: hp('2.5%'),
    },
    inputField: {
        width: wp('90%'),
        height: hp('7%'),
        backgroundColor: '#F2F2F2',
        alignSelf: 'center',
        paddingHorizontal: wp('4%'),
        borderRadius: 5,
        fontSize: wp('4%'),
        marginBottom: hp('1.5%'),
    },
    errorText: {
        color: 'red',
        fontSize: wp('3.5%'),
        marginLeft: wp('5%'),
        marginBottom: hp('1%'),
    },
    sectionContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontFamily: 'regular',
        fontSize: wp('6%'),
        width: '100%',
        color: '#121212',
        marginBottom: hp('2%'),
    },

    compositeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    prefixBox: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: wp('3%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        height: hp('4%'),
        alignSelf: 'center',
    },
    prefixText: {
        fontSize: wp('4.5%'),
        fontFamily: 'medium',
        color: '#000',
    },
    compositeInput: {
        flex: 1,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    map: {
        width: '100%',
        height: '100%',
    },
})
