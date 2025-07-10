import DateTimePicker from '@react-native-community/datetimepicker'
import { useRoute } from '@react-navigation/native'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MapView, { Marker } from 'react-native-maps'
import QRCode from 'react-native-qrcode-svg'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import {
    useCreateReservationMutation,
    useGetCarsQuery,
    useGetCentersQuery,
    useGetUserQuery,
    useLazyGetCarQuery,
    useLazyGetCenterAvailibilityQuery,
} from 'src/Services/API'
import { Car } from 'src/Services/Interface'
import { ArrowDownIcon, PlusIcon } from '../../../assets/svgs/Svg'
import Input from '../../Components/Shared/Input'
import MaintButton from '../../Components/Shared/MaintButton'
import Picker from '../../Components/Shared/Picker'
import useOcrImagePicker from '../../Services/hooks/useOcr'
import { useTranslation } from '../../Services/hooks/useTranslation'

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

const conditionalFields = {
    TU: [
        { name: 'mat', label: 'Serial Number' },
        { name: 'conf_mat', label: 'Confirm Serial Number' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    RS: [
        { name: 'mat', label: 'RS' },
        { name: 'conf_mat', label: 'Confirm RS' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    MOTO: [
        { name: 'mat', label: 'Motorcycle' },
        { name: 'conf_mat', label: 'Confirm Motorcycle' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    TRAC: [
        { name: 'mat', label: 'Tractor' },
        { name: 'conf_mat', label: 'Confirm Tractor' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    PAT: [
        { name: 'mat', label: 'PAT (م أ ف)' },
        { name: 'conf_mat', label: 'Confirm PAT (م أ ف)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    CMD: [
        { name: 'mat', label: 'CMD (ر ب د)' },
        { name: 'conf_mat', label: 'Confirm CMD (ر ب د)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    CD: [
        { name: 'mat', label: 'CD (س د)' },
        { name: 'conf_mat', label: 'Confirm CD (س د)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    MD: [
        { name: 'mat', label: 'MD (ب د)' },
        { name: 'conf_mat', label: 'Confirm MD (ب د)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    MC: [
        { name: 'mat', label: 'MC (ث ق)' },
        { name: 'conf_mat', label: 'Confirm MC (ث ق)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    CC: [
        { name: 'mat', label: 'CC (س ق)' },
        { name: 'conf_mat', label: 'Confirm CC (س ق)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    REM: [
        { name: 'mat', label: 'REM (ع م)' },
        { name: 'conf_mat', label: 'Confirm REM (ع م)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    AA: [
        { name: 'mat', label: 'AA (أ ف)' },
        { name: 'conf_mat', label: 'Confirm AA (أ ف)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    ES: [
        { name: 'mat', label: 'ES (م خ)' },
        { name: 'conf_mat', label: 'Confirm ES (م خ)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    PE: [
        { name: 'mat', label: 'PE' },
        { name: 'conf_mat', label: 'Confirm PE' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    IT: [
        { name: 'mat', label: 'IT (ت م)' },
        { name: 'conf_mat', label: 'Confirm IT (ت م)' },
        { name: 'serie', label: 'Last 5 characters of chassis number' },
    ],
    ETR: [
        { name: 'mat', label: 'Chassis Number' },
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

const getNextWeekday = (date) => {
    const day = date.getDay()
    const daysToAdd = day === 0 ? 1 : day === 6 ? 2 : 0 // Sunday = 0, Saturday = 6
    const nextWeekday = new Date(date)
    nextWeekday.setDate(date.getDate() + daysToAdd)
    return nextWeekday
}
export default function CreateVisitPage() {
    const { translate } = useTranslation()
    const mapRef = useRef<MapView>(null)

    const [scanVisible, setScanVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [dateVisible, setDateVisible] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'online' | 'on_place' | null>(null)
    const [createVisit, createVisitMutation] = useCreateReservationMutation()
    const [paymentVisible, setPaymentVisible] = useState(false)

    // Initialize selectedDate with a weekday
    const [selectedDate, setSelectedDate] = useState(() => getNextWeekday(new Date()))
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const route = useRoute()
    const { firstImage, secondImage, chooseImageSource, processImages } = useOcrImagePicker()
    const [pickerValue, setPickerValue] = useState()
    const car_id = route?.params?.car_id
    const { data: user } = useGetUserQuery({})
    const { data: centers } = useGetCentersQuery()
    const { data: userCars } = useGetCarsQuery({})
    const [car, setCar] = useState<Car | null>(null)
    const [selectedCenter, setSelectedCenter] = useState()
    const [getCar] = useLazyGetCarQuery()
    const [getAvailibility] = useLazyGetCenterAvailibilityQuery()
    const [availibility, setAvailibility] = useState()
    const [stripe, setStripe] = useState(false)
    const [qrVisible, setQrVisible] = useState(false)
    const [qrData, setQrData] = useState<string>('')
    const [selectedCar, setSelectedCar] = useState()

    const qrCodeRef = useRef(null)

    const saveQrToDisk = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Storage permission is required.')
            return
        }

        qrCodeRef.current?.toDataURL(async (dataURL) => {
            try {
                const path = FileSystem.cacheDirectory + `qr_code_${Date.now()}.png`
                const imageData = dataURL.replace('data:image/png;base64,', '')

                await FileSystem.writeAsStringAsync(path, imageData, {
                    encoding: FileSystem.EncodingType.Base64,
                })

                const asset = await MediaLibrary.createAssetAsync(path)
                await MediaLibrary.createAlbumAsync('Download', asset, false)

                Alert.alert('Success', 'QR Code saved to your gallery!')
            } catch (err) {
                console.error('Error saving QR:', err)
                Alert.alert('Error', 'Failed to save QR code.')
            }
        })
    }

    useEffect(() => {
        if (!selectedCenter) return

        getAvailibility({ id: selectedCenter, date: moment(selectedDate).locale('en').format('YYYY-MM-DD') })
            .unwrap()
            .then((data) => {
                setAvailibility(data)
            })
            .catch((error) => {
                console.error('Failed to fetch car:', error)
            })
    }, [selectedCenter, selectedDate])

    useEffect(() => {
        if (car_id) {
            setSelectedCar(car_id)
        }
    }, [car_id])

    useEffect(() => {
        if (!car_id) return

        setSelectedCar(car_id)

        const loadCar = async () => {
            try {
                const data = await getCar(car_id).unwrap()
                setCar(data)
            } catch (error) {
                console.error('Failed to fetch car:', error)
            }
        }

        loadCar()
    }, [car_id])

    useEffect(() => {
        if (!selectedCar) return

        const loadCar = async () => {
            try {
                const data = await getCar(selectedCar).unwrap()
                setCar(data)
            } catch (error) {
                console.error('Failed to fetch car:', error)
            }
        }

        loadCar()
    }, [selectedCar])

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm()

    useEffect(() => {
        if (car) {
            reset({
                matricule: car.matricule,
                adresse: car.adresse,
                genre: car.genre,
                nom: car.nom,
                inscrit: car.inscrit,
                place: car.place,
                porte: car.porte,
                typemoteur: car.typemoteur,
                cin: car.cin,
                commercial: car.commercial,
                construteur: car.construteur,
                dpmc: car.dpmc,
                serie: car.serie,
                type: car.type,
            })
        }
    }, [car])

    const applyOcrResult = (dataFromApi) => {
        if (!dataFromApi || !pickerValue) return

        const fields = conditionalFields[pickerValue]
        if (!fields || fields.length < 2) return

        const prefixType = ['TU', 'PE', 'PAT', 'CMD', 'CD', 'MD', 'MC', 'CC'].includes(pickerValue)

        Object.entries(dataFromApi).forEach(([ocrField, value]) => {
            if (value === undefined || value === null) return

            const mappedName = ocrField
            if (!mappedName) return

            const isMatriculeField = ['matricule', 'mat'].includes(ocrField) && fields[0].name === 'mat' && fields[1].name === 'conf_mat'

            if (isMatriculeField) {
                setValue(`matricule`, value, {
                    shouldDirty: true,
                    shouldValidate: true,
                })
                const parts = splitSerialNumber(value)
                console.log(parts)

                if (parts) {
                    const primary = isMatriculeField ? 'mat' : mappedName
                    const confirm = isMatriculeField ? 'conf_mat' : fields.find((f) => f.name !== primary)?.name

                    setValue(`${primary}_prefix`, parts.firstPart, {
                        shouldDirty: true,
                        shouldValidate: true,
                    })
                    setValue(`${primary}_suffix`, parts.lastPart, {
                        shouldDirty: true,
                        shouldValidate: true,
                    })

                    if (confirm) {
                        setValue(`${confirm}_prefix`, parts.firstPart, {
                            shouldDirty: true,
                            shouldValidate: true,
                        })
                        setValue(`${confirm}_suffix`, parts.lastPart, {
                            shouldDirty: true,
                            shouldValidate: true,
                        })
                    }
                }
            } else {
                // Non-prefix or unrelated fields
                setValue(mappedName, value, {
                    shouldDirty: true,
                    shouldValidate: true,
                })
            }
        })
    }

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: user?.address.lat ?? 35.8256,
                    longitude: user?.address.lng ?? 10.6084,
                    latitudeDelta: 0.2044,
                    longitudeDelta: 0.0842,
                },
                900
            )
        }
    }, [mapRef])

    const handleScan = async () => {
        try {
            const ocrResult = await processImages()
            console.log('ocr', ocrResult)

            applyOcrResult(ocrResult)
        } catch (e) {
            console.error(e)
            alert('Erreur lors du scan OCR.')
        }
    }

    const handleConfirmPaymentFinale = async (data) => {
        let info
        if (car) {
            info = {
                car_id: car.id,
                date: `${selectedDate.toDateString()} ${selectedTimeSlot}`,
                center_id: selectedCenter,
                user_id: user?.id || null,
            }
        } else {
            info = {
                car_info: {
                    matricule: data.matricule,
                    adresse: data.adresse,
                    genre: data.genre,
                    nom: data.nom,
                    inscrit: data.inscrit,
                    place: data.place,
                    porte: data.porte,
                    typemoteur: data.typemoteur,
                    cin: data.cin,
                    commercial: data.commercial,
                    construteur: data.construteur,
                    dpmc: data.dpmc,
                    serie: data.serie,
                    type: data.type,
                },
                date: `${selectedDate.toDateString()} ${selectedTimeSlot}`,
                center_id: selectedCenter,
                user_id: user?.id || null,
            }
        }

        try {
            await createVisit(info).then((res) => {
                if (!res.error) {
                    setStripe(false)
                    setQrData(JSON.stringify(res.data)) // you can encode only the ID or details if you want
                    setQrVisible(true)

                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: translate('Appointment created successfully'),
                    })
                }
            })
        } catch (error: any) {
            console.error(error)
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: translate('Failed to create appointment'),
            })
        }
    }

    const resetAll = () => {
        reset() // reset react-hook-form fields
        setSelectedDate(getNextWeekday(new Date()))
        setSelectedTimeSlot(null)
        setSelectedPaymentMethod(null)
        setSelectedCar(undefined)
        setSelectedCenter(undefined)
        setCar(null)
        setModalVisible(false)
        setDateVisible(false)
        setPaymentVisible(false)
        setQrVisible(false)
        setStripe(false)
        setPickerValue(undefined)
        setAvailibility(undefined)
    }

    const handleConfirmPayment = async (data) => {
        // handle your payment logic here
        if (selectedPaymentMethod == 'online') {
            setPaymentVisible(false)

            setStripe(true)
        } else {
            let info
            if (car) {
                info = {
                    car_id: car.id,
                    date: `${selectedDate.toDateString()} ${selectedTimeSlot}`,
                    center_id: selectedCenter,
                    user_id: user?.id || null,
                }
            } else {
                info = {
                    car_info: {
                        matricule: data.matricule,
                        adresse: data.adresse,
                        genre: data.genre,
                        nom: data.nom,
                        inscrit: data.inscrit,
                        place: data.place,
                        porte: data.porte,
                        typemoteur: data.typemoteur,
                        cin: data.cin,
                        commercial: data.commercial,
                        construteur: data.construteur,
                        dpmc: data.dpmc,
                        serie: data.serie,
                        type: data.type,
                    },
                    date: `${selectedDate.toDateString()} ${selectedTimeSlot}`,
                    center_id: selectedCenter,
                    user_id: user?.id || null,
                }
            }

            try {
                await createVisit(info).then((res) => {
                    if (!res.error) {
                        setModalVisible(false)
                        setDateVisible(false)
                        setPaymentVisible(false)
                        resetAll()

                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: translate('Appointment created successfully'),
                        })
                    }
                })
            } catch (error: any) {
                console.error(error)
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: translate('Failed to create appointment'),
                })
            }
        }
    }

    // Updated onDateChange handler
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

    // Ensure initial date is not a weekend

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot.hour)
    }

    const handleConfirm = async () => {
        setModalVisible(false)
        setDateVisible(false)
        setPaymentVisible(true)
    }

    const splitSerialNumber = (fullValue: string) => {
        if (!fullValue) return null

        // Remove extra whitespace, keep Arabic or Latin words in between
        const cleaned = fullValue.trim().replace(/\s+/g, ' ')
        console.log('cleaned', cleaned)

        // Match common Tunisian plate formats: 4 digits, middle word, 3 digits
        const match = cleaned.match(/^(\d{3,4})\s+[^\d]+\s+(\d{2,4})$/)

        if (!match) return null

        const firstPart = match[1]
        const lastPart = match[2]

        return { firstPart, lastPart }
    }

    useEffect(() => {
        if (!car?.matricule || !pickerValue) return

        const parts = splitSerialNumber(car.matricule)
        if (!parts) return

        const fields = conditionalFields[pickerValue]
        if (!fields || fields.length < 2) return

        const isPrefixField = ['serie'].includes(fields[0].name)
        const prefixType = ['TU', 'PE', 'PAT', 'CMD', 'CD', 'MD', 'MC', 'CC'].includes(pickerValue)

        // Check if this is a prefix type field (not chassis)
        if (prefixType && !isPrefixField) {
            // For prefix fields, set both main and confirmation fields
            setValue(`${fields[0].name}_prefix`, parts.firstPart, {
                shouldDirty: true,
                shouldValidate: true,
            })

            setValue(`${fields[0].name}_suffix`, parts.lastPart, {
                shouldDirty: true,
                shouldValidate: true,
            })

            // Set confirmation field (fields[1] is the conf field)
            setValue(`${fields[1].name}_prefix`, parts.firstPart, {
                shouldDirty: true,
                shouldValidate: true,
            })

            setValue(`${fields[1].name}_suffix`, parts.lastPart, {
                shouldDirty: true,
                shouldValidate: true,
            })
        } else {
            // For non-prefix fields, use original field names
            setValue(fields[0].name, parts.firstPart, {
                shouldDirty: true,
                shouldValidate: true,
            })

            setValue(fields[1].name, parts.lastPart, {
                shouldDirty: true,
                shouldValidate: true,
            })
        }
    }, [car?.matricule, pickerValue])

    return (
        <KeyboardAwareScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.sectionContainer}>
                    {user && (
                        <Picker
                            title='Select Car'
                            onValueChange={(value) => setSelectedCar(value)}
                            items={userCars?.map((car) => {
                                return { label: car.matricule, value: car.id }
                            })}
                            value={selectedCar}
                            placeholder={'Select Car'}
                            // @ts-ignore
                            Icon={() => {
                                return <ArrowDownIcon color='#000' />
                            }}
                        />
                    )}
                    <Picker
                        title='type of registration series'
                        onValueChange={(value) => setPickerValue(value)}
                        items={registrationTypes}
                        placeholder={'type of registration series'}
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
                                        const isPrefixField = ['serie'].includes(field.name)
                                        const prefixType = ['TU', 'PE', 'PAT', 'CMD', 'CD', 'MD', 'MC', 'CC'].includes(pickerValue)

                                        if (prefixType && !isPrefixField) {
                                            return (
                                                <View key={field.name}>
                                                    <Text style={[styles.prefixText, { marginBottom: hp('1%'), color: 'grey' }]}>{field.label}</Text>

                                                    <View style={styles.inputsContainer}>
                                                        <Input
                                                            name={`${field.name}_prefix`} // Changed: Added _prefix suffix
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
                                                            name={`${field.name}_suffix`} // Changed: Added _suffix suffix
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
                                latitude: user?.address.lat ?? 35.8256,
                                longitude: user?.address.lng ?? 10.6084,
                                latitudeDelta: 0.2044,
                                longitudeDelta: 0.0842,
                            }}
                            showsUserLocation={true}>
                            {centers?.map((center) => {
                                return (
                                    <Marker
                                        onPress={() => {
                                            setSelectedCenter(center.id)
                                            setModalVisible(false)
                                            setDateVisible(true)
                                        }}
                                        coordinate={{
                                            latitude: center.latitude,
                                            longitude: center.longitude,
                                        }}></Marker>
                                )
                            })}
                        </MapView>
                        <Pressable
                            onPress={() => {
                                setModalVisible(false)
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

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={dateVisible}
                    onRequestClose={() => {
                        setDateVisible(false), setModalVisible(true)
                    }}>
                    <Pressable
                        onPress={() => {
                            setDateVisible(false), setModalVisible(true)
                        }}
                        style={styles.modalView}>
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
                                        setDateVisible(false), setModalVisible(true)
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
                                    onPress={() => {
                                        setPaymentVisible(false), setDateVisible(true)
                                    }}>
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
                                    onPress={handleSubmit(handleConfirmPayment)}
                                    disabled={!selectedPaymentMethod}>
                                    {createVisitMutation.isLoading ? (
                                        <ActivityIndicator />
                                    ) : (
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: selectedPaymentMethod ? 'white' : '#888',
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

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={stripe}
                    onRequestClose={() => {
                        setStripe(false), setPaymentVisible(true)
                    }}>
                    <Pressable
                        onPress={() => {
                            setStripe(false), setPaymentVisible(true)
                        }}
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View
                            onStartShouldSetResponder={() => true}
                            style={{
                                height: '90%',
                                backgroundColor: 'white',
                                width: '100%',
                                position: 'absolute',
                                bottom: 0,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                padding: 20,
                            }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 20 }}>Add card</Text>

                                {/* Contact Information */}
                                <Text style={{ fontWeight: '600', color: '#888', marginBottom: 8 }}>Contact information</Text>
                                <TextInput placeholder='Email' style={styles.stripeInput} />
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <View style={[styles.stripeInput, { flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
                                        <Text>🇹🇳 +216</Text>
                                    </View>
                                    <TextInput placeholder='Phone number' style={[styles.stripeInput, { flex: 2 }]} />
                                </View>

                                {/* Card Information */}
                                <Text style={{ fontWeight: '600', color: '#888', marginVertical: 12 }}>Card information</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TextInput placeholder='Name on card' style={[styles.stripeInput, { flex: 1 }]} />
                                </View>
                                <TextInput placeholder='Card number' style={styles.stripeInput} />
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <TextInput placeholder='MM / YY' style={[styles.stripeInput, { flex: 1 }]} />
                                    <TextInput placeholder='CVC' style={[styles.stripeInput, { flex: 1 }]} />
                                </View>

                                {/* Billing Address */}
                                <Text style={{ fontWeight: '600', color: '#888', marginVertical: 12 }}>Billing address</Text>
                                <TextInput placeholder='Country or region' style={styles.stripeInput} value='Tunisia' />
                                <TextInput placeholder='Address line 1' style={styles.stripeInput} />
                                <TextInput placeholder='Address line 2 (optional)' style={styles.stripeInput} />
                                <TextInput placeholder='City' style={styles.stripeInput} />
                                <TextInput placeholder='State' style={styles.stripeInput} value='Sousse' />
                                <TextInput placeholder='ZIP' style={styles.stripeInput} />

                                {/* Pay Button */}
                                <Pressable
                                    onPress={handleSubmit(handleConfirmPaymentFinale)}
                                    style={{
                                        marginTop: 24,
                                        backgroundColor: '#007aff',
                                        padding: 16,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                    }}>
                                    {createVisitMutation.isLoading ? (
                                        <ActivityIndicator />
                                    ) : (
                                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Pay $97.42</Text>
                                    )}
                                </Pressable>
                            </ScrollView>
                        </View>
                    </Pressable>
                </Modal>

                <Modal animationType='slide' transparent={true} visible={qrVisible} onRequestClose={() => setQrVisible(false)}>
                    <Pressable onPress={() => setQrVisible(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View
                            onStartShouldSetResponder={() => true}
                            style={{
                                height: '40%',
                                backgroundColor: 'white',
                                width: '100%',
                                position: 'absolute',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bottom: 0,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                padding: 20,
                            }}>
                            <QRCode value={qrData} size={130} getRef={(c) => (qrCodeRef.current = c)} />
                            <Text style={{ fontSize: 18, marginVertical: 20, width: '70%', textAlign: 'center' }}>
                                {translate('Present the QR code the day of the visit')}
                            </Text>

                            <Pressable
                                onPress={async () => {
                                    await saveQrToDisk(), setQrVisible(false), resetAll()
                                }}
                                style={{
                                    backgroundColor: '#000',
                                    padding: 16,
                                    width: '90%',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                }}>
                                <Text style={{ color: 'white' }}>{translate('Download QR code')}</Text>
                            </Pressable>
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
    stripeInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#fff',
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
