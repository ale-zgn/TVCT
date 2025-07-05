import React from 'react'
import { FlatList, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import CarItem from '../../Components/Shared/Property'

import { useNavigation } from '@react-navigation/native'
import MaintButton from 'src/Components/Shared/MaintButton'
import { useGetCarsQuery } from 'src/Services/API'
import { useTranslation } from '../../Services/hooks/useTranslation'

export default function MyPropertiesScreen() {
    const { translate, language } = useTranslation()
    const { data: cars } = useGetCarsQuery({})
    console.log('cars', cars)

    const navigation = useNavigation()
    // const filteredProperties = React.useMemo(() => {
    //     if (!selectedFilter) return properties
    //     return properties?.filter((item) => item.name.includes(selectedFilter))
    // }, [selectedFilter])

    return (
        <View style={styles.wrapper}>
            <StatusBar backgroundColor='#fcfcfc' barStyle='dark-content' />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingTop: hp('5%') }}>
                <FlatList
                    contentContainerStyle={styles.flatList}
                    scrollEnabled={false}
                    data={cars}
                    renderItem={({ item }) => <CarItem Car={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={() => (
                        <View style={{ alignItems: 'center', height: hp('50%'), justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontFamily: 'medium', fontSize: wp('5%'), color: '#000' }}>{translate('No properties found')}</Text>
                        </View>
                    )}
                />
            </ScrollView>
            <MaintButton
                title='Add a car'
                action={() => {
                    navigation.navigate('AddCarPage')
                }}
                style={{ marginTop: hp('1%') }}
                backgroundColor='black'
                textColor='white'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: wp('6%'),
        fontFamily: 'bold',
        color: '#000',
        marginTop: hp('1%'),
        marginLeft: wp('5%'),
        marginBottom: hp('2.5%'),
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        alignItems: 'center',
        paddingBottom: hp('10%'),
    },
    scrollView: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: wp('90%'),
        marginVertical: hp('2.5%'),
        marginBottom: hp('0.5%'),
    },
    filterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: '#EDEDED',
    },
    filterText: {
        marginRight: 5,
    },
    separator: {
        height: hp('2%'),
    },
    flatList: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('5%'),
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
})
