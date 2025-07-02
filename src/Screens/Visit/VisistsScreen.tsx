import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { LeftArrowIcon, RightArrowIcon } from 'assets/svgs/Svg'
import { BlurView } from 'expo-blur'
import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Title from 'src/Components/Shared/Title'
import { useTranslation } from 'src/Services/hooks/useTranslation'
export default function VisitsScreen() {
    const { translate, language: selectedLanguage } = useTranslation()
    const [searchText, setSearchText] = useState('')

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
                                    marginBottom: hp('1%'),
                                    fontWeight: 'bold',
                                    color: '#000',
                                }}>
                                Car Matricule ABC-123
                            </Text>
                            <Text style={{ fontSize: wp('3.8%'), color: '#444' }}>Visit at City Center - 10:30 AM</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                            <MaterialCommunityIcons name='check' size={24} color='green' />
                            <MaterialCommunityIcons name='close' size={24} color='red' />
                            {selectedLanguage === 'en' ? <RightArrowIcon color='#000' /> : <LeftArrowIcon color='#000' />}
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
                        <Text style={{ fontSize: wp('4.5%'), fontFamily: 'regular' }}>{translate('No properties found')}</Text>
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
