import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import MaintButton from 'src/Components/Shared/MaintButton'
import Title from 'src/Components/Shared/Title'
import { useDeleteCenterMutation, useGetCentersQuery } from 'src/Services/API'
import { useTranslation } from 'src/Services/hooks/useTranslation'

export default function CentersScreen() {
    const { translate, language: selectedLanguage } = useTranslation()
    const [searchText, setSearchText] = useState('')
    const { data: centers } = useGetCentersQuery()
    const [deleteCenter, deleteCenterMutation] = useDeleteCenterMutation()

    const filteredCenters = useMemo(() => {
        if (!searchText.trim()) return centers
        return centers?.filter((center) => center.name.toLowerCase().includes(searchText.toLowerCase()))
    }, [searchText, centers])
    const navigation = useNavigation()

    return (
        <View style={{ backgroundColor: 'white', flex: 1, paddingBottom: hp('10%') }}>
            <Title value={translate('Available centers')} />

            <TextInput
                placeholder={translate('Search by location')}
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
                placeholderTextColor='#888'
            />

            <FlatList
                data={filteredCenters}
                numColumns={2}
                scrollEnabled
                contentContainerStyle={styles.flatList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <BlurView intensity={10} tint='dark' style={styles.card}>
                            <View style={{ width: '100%' }}>
                                <Text style={styles.locationText}>{item.name}</Text>
                                <Text style={styles.detailText}>{translate('Available at')}:</Text>
                                <Text style={styles.detailText}>
                                    {moment(item.availability_start_date).locale('en').format('HH:MM')} -{' '}
                                    {moment(item.availability_end_date).locale('en').format('HH:MM')}
                                </Text>
                                <Text style={styles.detailText}>
                                    {translate('Visits')}: {item.reservations.length}
                                </Text>
                            </View>
                            <Pressable
                                onPress={() => {
                                    Alert.alert('Confirm Deletion', 'Are you sure you want to delete this center?', [
                                        {
                                            text: 'Cancel',
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Delete',
                                            style: 'destructive',
                                            onPress: async () => {
                                                await deleteCenter(item.id)
                                            },
                                        },
                                    ])
                                }}>
                                {deleteCenterMutation.isLoading ? (
                                    <ActivityIndicator />
                                ) : (
                                    <MaterialCommunityIcons name='trash-can-outline' size={24} color='black' />
                                )}
                            </Pressable>
                        </BlurView>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{translate('No centers found')}</Text>
                    </View>
                )}
                ListFooterComponentStyle={{ marginTop: hp('5%') }}
            />
            <MaintButton
                action={() => {
                    navigation.navigate('NewCenterScreen')
                }}
                title={translate('Add center')}
                backgroundColor='black'
                textColor='white'
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
        paddingTop: hp('1%'),
    },
    cardWrapper: {
        flex: 1,
        padding: wp('1.5%'),
    },
    card: {
        padding: hp('2%'),
        borderRadius: 16,
        overflow: 'hidden',
        height: hp('18%'),
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    locationText: {
        fontSize: wp('4.2%'),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: hp('0.5%'),
    },
    detailText: {
        fontSize: wp('3.8%'),
        color: '#333',
        marginTop: hp('0.3%'),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: hp('10%'),
    },
    emptyText: {
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
    },
})
