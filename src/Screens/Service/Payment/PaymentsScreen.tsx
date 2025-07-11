import { BlurView } from 'expo-blur'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Title from 'src/Components/Shared/Title'
import { useGetPaymentsQuery } from 'src/Services/API'
import { useTranslation } from '../../../Services/hooks/useTranslation'

const PaymentsScreen = () => {
    const { language, translate } = useTranslation()
    const { data } = useGetPaymentsQuery()
    console.log(data)

    return (
        <View style={styles.container}>
            <Title value='My payments' />
            <FlatList
                contentContainerStyle={styles.flatList}
                showsVerticalScrollIndicator={false}
                data={data} // Replace with real data later
                renderItem={({ item }) => (
                    <BlurView intensity={25} tint='light' style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>
                                {translate('Car')}: <Text style={styles.value}>{item?.reservation?.car?.matricule ?? '-'}</Text>
                            </Text>

                            <Text style={styles.label}>
                                {translate('Center')}: <Text style={styles.value}>{item?.reservation?.center?.name ?? '-'}</Text>
                            </Text>

                            <Text style={styles.label}>
                                {translate('Card Used')}: <Text style={styles.value}>{item?.card ?? '-'}</Text>
                            </Text>

                            <Text style={[styles.label, { marginTop: hp('1%') }]}>
                                {translate('Amount')}: <Text style={styles.amount}>${item?.amount?.toFixed(2) ?? '0.00'}</Text>
                            </Text>
                        </View>
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
                        <Text style={{ fontSize: wp('4.5%'), fontFamily: 'regular' }}>{translate('No reservations found')}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    flatList: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
    },
    separator: {
        width: wp('2%'),
    },
    card: {
        flexDirection: 'column',
        width: '100%',
        marginVertical: hp('0.7%'),
        padding: hp('2%'),
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: 'rgba(221, 221, 221, 0.5)',
    },

    label: {
        fontSize: wp('3.8%'),
        fontWeight: '600',
        color: '#333',
        marginBottom: hp('0.7%'),
    },

    value: {
        fontWeight: '400',
        color: '#555',
    },

    amount: {
        fontWeight: '700',
        color: '#007aff',
        fontSize: wp('4.2%'),
    },
})

export default PaymentsScreen
