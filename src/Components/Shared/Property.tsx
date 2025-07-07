import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { LeftArrowIcon, RightArrowIcon } from '../../../assets/svgs/Svg'
import { useTranslation } from '../../Services/hooks/useTranslation'

import { ImageBackground } from 'expo-image'
import { Car } from 'src/Services/Interface'

export default function CarItem({ Car }: { Car: Car }) {
    const navigation = useNavigation()
    const { translate, language } = useTranslation()

    return (
        <Pressable
            style={styles.propertyWrapper}
            onPress={() => {
                //@ts-ignore
                navigation.navigate('MyCarDetails', {
                    car_id: Car.id,
                })
            }}>
            <ImageBackground
                placeholder={{
                    blurhash:
                        '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[',
                }}
                source={require('../../../assets/images/exampleCar3.jpg')}>
                <View style={styles.propertyOverlay}>
                    <View style={styles.statusWrapper}>
                        <Text style={styles.status}>{Car?.type}</Text>
                    </View>

                    <Text style={styles.propertyName}>{Car?.construteur}</Text>

                    <View style={styles.propertyLocationWrapper}>
                        <Text style={styles.propertyLocation}>{Car?.genre}</Text>
                    </View>
                    <View style={styles.propertyLocationWrapper}>
                        <Text style={styles.propertyLocation}>{Car?.matricule}</Text>
                    </View>
                    <View style={styles.propertyDetailsWrapper}>
                        <Text style={styles.propertyDetails}>{translate('View details')}</Text>
                        {language === 'en' ? <RightArrowIcon color='#fff' /> : <LeftArrowIcon color='#fff' />}
                    </View>
                </View>
            </ImageBackground>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: wp('9%'),
        height: wp('9%'),
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 25,
        backgroundColor: 'white',
    },
    closeButtonText: {
        color: 'white',
    },
    flatList: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
    },
    separator: {
        width: wp('2%'),
    },
    insertWrapper: {
        width: wp('90%'),
        height: hp('20%'),
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp('2.5%'),
    },
    insertLeft: {
        height: '100%',
        justifyContent: 'center',
        marginLeft: wp('7.5%'),
        width: wp('50%'),
    },
    insertRight: {
        width: wp('32.5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    insertTitle: {
        fontSize: wp('4.25%'),
        fontFamily: 'bold',
        color: '#fff',
    },
    insertDescription: {
        fontSize: wp('3.75%'),
        fontFamily: 'regular',
        color: '#fff',
        marginTop: hp('1.5%'),
    },
    titleWrapper: {
        alignSelf: 'flex-start',
        marginLeft: wp('5%'),
    },
    viewAll: {
        fontSize: wp('4.5%'),
        color: '#707070',
        fontFamily: 'regular',
    },
    // propertyTypeWrapper: {
    //     paddingVertical: hp('1.5%'),
    //     paddingHorizontal: wp('5%'),
    //     borderRadius: 15,
    //     backgroundColor: 'white',
    //     borderWidth: 1,
    //     borderColor: '#F2F2F2',
    // },
    // propertyTypeTitle: {
    //     fontSize: wp('3.5%'),
    //     color: 'black',
    // },
    featuredPropertyWrapper: {
        width: wp('38.5%'),
        backgroundColor: 'white',
        alignItems: 'center',
        paddingBottom: hp('1%'),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
    },
    featuredPropertyImage: {
        width: '100%',
        height: hp('14.5%'),
    },
    heartWrapper: {
        position: 'absolute',
        top: hp('1%'),
        right: wp('1.5%'),
        opacity: 0.8,
        padding: 10,
        borderRadius: 50,
        blurRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff3d',
    },
    nameWrapper: {
        alignSelf: 'flex-start',
        marginTop: hp('1%'),
        backgroundColor: 'white',
        marginLeft: wp('2.5%'),
    },
    name: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
    },
    locationWrapper: {
        flexDirection: 'row',
        marginTop: wp('0.5%') * -1,
        alignItems: 'center',
    },
    location: {
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        color: '#666666',
        marginLeft: wp('1%'),
        paddingTop: hp('0.25%'),
    },
    units: {
        color: '#666666',
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        alignSelf: 'flex-start',
        marginLeft: wp('2.5%'),
        marginTop: hp('0.3%'),
        // marginTop: hp('1%'),
    },
    details: {
        color: '#85553A',
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        alignSelf: 'flex-start',
        marginLeft: wp('2.5%'),
        marginTop: hp('0.3%'),
    },
    newsImage: {
        width: wp('32.5%'),
        height: '100%',
        borderRadius: 7.5,
    },
    newsContentWrapper: {
        marginLeft: wp('5%'),
        width: wp('45%'),
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'space-around',
    },
    newsTitle: {
        fontSize: wp('5.5%'),
        fontFamily: 'regular',
        color: '#fff',
        marginTop: hp('2%'),
        width: wp('65%'),
        marginBottom: hp('1%'),
    },
    newsDate: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
        color: '#fff',
    },
    readMoreWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    newsSeparator: {
        height: hp('2%'),
    },
    serviceWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceIconWrapper: {
        borderWidth: 2,
        width: wp('21%'),
        height: wp('20%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceTitle: {
        fontSize: wp('4.25%'),
        fontFamily: 'medium',
        marginTop: hp('1.5%'),
        color: '#171717',
    },
    propertyWrapper: {
        width: wp('90%'),
        height: hp('41%'),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    propertyImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    propertyOverlay: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    propertyName: {
        fontSize: wp('7%'),
        fontFamily: 'regular',
        color: 'white',
        marginLeft: wp('5%'),
        alignSelf: 'flex-start',
    },
    propertyLocation: {
        fontSize: wp('5.5%'),
        fontFamily: 'regular',
        color: 'white',
        marginLeft: wp('1%'),
        paddingTop: hp('0.5%'),
    },
    propertyDetailsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp('2.5%'),
        marginTop: hp('1.5%'),
        width: wp('90%'),
        paddingHorizontal: wp('5%'),
    },
    propertyDetails: {
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        color: 'white',
    },
    propertyLocationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('5%'),
    },
    statusWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#707070',
        borderColor: '#FFFFFF',
        paddingVertical: hp('0.5%'),
        paddingHorizontal: wp('2%'),
        position: 'absolute',
        top: 15,
        right: 15,
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
    newsWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.60)',
        width: wp('100%'),
        height: hp('35%'),
        paddingBottom: hp('3.5%'),
        paddingLeft: wp('5%'),
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    newsCategoryContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: '#85553A',
        borderColor: '#99705A',
        borderWidth: 2,
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1%'),
    },
    newsCategory: {
        fontSize: wp('5%'),
        fontFamily: 'medium',
        color: '#fff',
    },
})
