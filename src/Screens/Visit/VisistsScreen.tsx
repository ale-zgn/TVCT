import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { BlurView } from 'expo-blur'
import moment from 'moment'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Title from 'src/Components/Shared/Title'
import { useGetAllReservationsQuery, useUpdateReservationStatusMutation } from 'src/Services/API'
import { useTranslation } from 'src/Services/hooks/useTranslation'
import { ReservationStatus } from 'src/Services/Interface'
export default function VisitsScreen() {
    const { translate, language: selectedLanguage } = useTranslation()
    const [searchText, setSearchText] = useState('')
    const { data: visits } = useGetAllReservationsQuery()
    const [updateStatus, updateStatusMutation] = useUpdateReservationStatusMutation()

    const handleStatusUpdate = async (reservationId: number, newStatus: number) => {
        try {
            await updateStatus({
                id: reservationId,
                status: newStatus,
            }).unwrap()

            Toast.show({
                title: translate(newStatus === 1 ? 'Visit confirmed successfully' : 'Visit rejected successfully'),
                type: ALERT_TYPE.SUCCESS,
            })
        } catch (error) {
            console.error('Error updating status:', error)
            Toast.show({
                title: translate('Failed to update visit status'),
                type: ALERT_TYPE.DANGER,
            })
        }
    }

    const confirmAccept = (item) => {
        Alert.alert(translate('Confirm Accept'), translate('Are you sure you want to accept this visit?'), [
            {
                text: translate('Cancel'),
                style: 'cancel',
            },
            {
                text: translate('Accept'),
                style: 'default',
                onPress: () => handleStatusUpdate(item.id, ReservationStatus.ACCEPTED),
            },
        ])
    }

    const confirmReject = (item) => {
        Alert.alert(translate('Confirm Reject'), translate('Are you sure you want to reject this visit?'), [
            {
                text: translate('Cancel'),
                style: 'cancel',
            },
            {
                text: translate('Reject'),
                style: 'destructive',
                onPress: () => handleStatusUpdate(item.id, ReservationStatus.REJECTED),
            },
        ])
    }

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Title value={translate('Pending visits')} />

            <TextInput
                placeholder={translate('Search...')}
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
                placeholderTextColor='#888'
            />
            <FlatList
                contentContainerStyle={styles.flatList}
                showsVerticalScrollIndicator={false}
                data={visits?.filter(
                    (item) =>
                        item.car.matricule.toLowerCase().includes(searchText.toLowerCase()) || item.center.name.toLowerCase().includes(searchText.toLowerCase())
                )}
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
                                    fontSize: wp('3.75%'),
                                    fontWeight: '500',
                                    color: '#000',
                                    marginBottom: hp('1%'),
                                }}>
                                Car Matricule {item.car.matricule}
                            </Text>
                            <Text style={{ fontSize: wp('3.25%'), color: '#444' }}>
                                Visit at {item.center.name} - {moment(item.date).locale('en').format('DD MMM YYYY HH:mm')}
                            </Text>
                        </View>
                        {updateStatusMutation.isLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('4%') }}>
                                <Pressable onPress={() => confirmAccept(item)}>
                                    <MaterialCommunityIcons name='check' size={20} color='green' />
                                </Pressable>
                                <Pressable onPress={() => confirmReject(item)}>
                                    <MaterialCommunityIcons name='close' size={20} color='red' />
                                </Pressable>
                            </View>
                        )}
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
                        <Text style={{ fontSize: wp('4.5%'), fontFamily: 'regular' }}>{translate('No visits found')}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchInput: {
        backgroundColor: '#f2f2f2',
        marginHorizontal: wp('5%'),
        borderRadius: 16,
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('2.5%'),
        fontSize: wp('4%'),
        marginVertical: hp('1.5%'),
        color: '#000',
    },
    flatList: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
    },
    separator: {
        width: wp('2%'),
    },
})
