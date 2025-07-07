import React from 'react'
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { ArrowLeftIcon, BoldRightArrowIcon, LockIcon, LogoutIcon, PersonIcon } from '../../../assets/svgs/Svg'
import { S3Image } from '../../Components/Shared/S3Image'
import { API, useGetUserQuery } from '../../Services/API'
import { useTranslation } from '../../Services/hooks/useTranslation'
import { store } from '../../Store/store'

export default function ProfileModal() {
    const { translate, language } = useTranslation()
    const { data: user } = useGetUserQuery({})
    const items = [
        {
            name: 'Personal informations',
            icon: <PersonIcon />,
            action: 'PersonalInformationsModal',
        },
        // {
        //     name: "Change password",
        //     icon: <LockIcon />,
        //     action: "ChangePasswordModal",
        // },
        /*     {
            name: 'Language',
            icon: <HearthIcon />,
            action: 'LanguageModal',
        }, */
        // {
        //     name: "Alert notifications",
        //     icon: <AlertIcon />,
        //     action: "AlertNotificationsModal",
        // },
    ]

    console.log(user)

    const navigation = useNavigation()

    return (
        <ScrollView style={styles.wrapper} contentContainerStyle={{ paddingBottom: hp('2.5%') }}>
            {user ? (
                <View style={styles.header}>
                    <View>
                        <S3Image file={user.image} folder={'users/images'} customStyle={styles.image} />
                    </View>
                    <Text style={styles.name}>
                        {/* @ts-ignore */}
                        {user?.full_name}
                    </Text>
                </View>
            ) : (
                <View style={styles.indicator}>
                    <ActivityIndicator size='small' />
                </View>
            )}

            <FlatList
                data={items}
                renderItem={({ item }) => <ProfileItem name={item.name} icon={item.icon} action={item.action} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{
                    backgroundColor: '#fff',
                    paddingVertical: hp('1%'),
                    paddingHorizontal: wp('5%'),
                    marginTop: hp('2%'),
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.05,
                }}
                style={{
                    width: '90%',
                    alignSelf: 'center',
                }}
            />

            {/* <View style={styles.itemsContainer}>
                <View style={styles.itemContainer}>
                    <View style={styles.item}>
                        <View style={styles.itemIconContainer}>
                            <FaceIcon />
                        </View>
                        <Text style={styles.itemText}>{translate("Face ID")}</Text>
                    </View>
                    <Switch
                        value={faceId}
                        onValueChange={() => {
                            setFaceId(!faceId)
                        }}
                        trackColor={{
                            true: "#3CBB16",
                            false: "#F2F2F2",
                        }}
                        thumbColor={"#fff"}
                    />
                </View>
            </View> */}

            {user?.sf_account_id === '0018e00000KHFD6AAP' && (
                <Pressable
                    style={styles.itemsContainer}
                    onPress={async () => {
                        //@ts-ignore
                        navigation.navigate('AccessAccountModal')
                    }}>
                    <View style={styles.itemContainer}>
                        <View style={styles.item}>
                            <View style={styles.itemIconContainer}>
                                <LockIcon />
                            </View>
                            <Text style={styles.itemText}>{translate('Access account')}</Text>
                        </View>
                        {language === 'ar' ? <ArrowLeftIcon /> : <BoldRightArrowIcon />}
                    </View>
                </Pressable>
            )}

            <Pressable
                style={styles.itemsContainer}
                onPress={async () => {
                    //set time out to allow the push token to be unregistered before logging out
                    setTimeout(async () => {
                        await SecureStore.deleteItemAsync('token')
                        store.dispatch(API.util.resetApiState())
                        Toast.show({
                            title: translate('You have been logged out'),
                            type: ALERT_TYPE.SUCCESS,
                        })
                        //@ts-ignore
                        navigation.replace('TabNavigatorUnlogged')
                    }, 100)
                }}>
                <View style={styles.itemContainer}>
                    <View style={styles.item}>
                        <View style={styles.itemIconContainer}>
                            <LogoutIcon />
                        </View>
                        <Text style={styles.itemText}>{translate('Logout')}</Text>
                    </View>
                    {language === 'ar' ? <ArrowLeftIcon /> : <BoldRightArrowIcon />}
                </View>
            </Pressable>
        </ScrollView>
    )
}

function ProfileItem({ name, icon, action }: { name: string; icon: any; action: string }) {
    const { translate, language } = useTranslation()
    const navigation = useNavigation()
    return (
        <Pressable
            style={styles.itemContainer}
            onPress={() => {
                //@ts-ignore
                navigation.navigate(action)
            }}>
            <View style={styles.item}>
                <View style={styles.itemIconContainer}>{icon}</View>
                <Text style={styles.itemText}>{translate(`${name}`)}</Text>
            </View>
            {language === 'ar' ? <ArrowLeftIcon /> : <BoldRightArrowIcon />}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingTop: hp('3.5%'),
        paddingBottom: hp('2%'),
    },
    name: {
        fontSize: wp('5.5%'),
        fontFamily: 'bold',
        color: '#000',
        marginTop: hp('1.5%'),
    },
    image: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customerNumber: {
        fontSize: wp('3.75%'),
        fontFamily: 'medium',
        color: '#000',
        marginTop: hp('0.5%'),
    },
    coinsContainer: {
        position: 'absolute',
        bottom: hp('-1%'),
        right: wp('-7.5%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#85553A',
        borderRadius: 30,
        paddingHorizontal: wp('2.25%'),
        paddingVertical: hp('1%'),
        borderWidth: 3,
        borderColor: '#fff',
    },
    coinsValue: {
        fontSize: wp('3.75%'),
        fontFamily: 'medium',
        marginRight: wp('1%'),
        color: '#fff',
    },
    customerText: {
        fontSize: wp('3.75%'),
        fontFamily: 'regular',
        color: '#666666',
    },
    customerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completeProfileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%'),
        backgroundColor: '#F3EDEB',
        width: wp('90%'),
        alignSelf: 'center',
        height: hp('10%'),
    },
    completeProfileTitle: {
        fontSize: wp('6%'),
        fontFamily: 'regular',
        color: '#000',
        alignSelf: 'flex-start',
    },
    completeProfileText: {
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        color: '#000',
        alignSelf: 'flex-start',
    },
    progressContainer: {
        width: wp('75%'),
        height: hp('0.5%'),
        backgroundColor: '#85553A50',
        borderRadius: 30,
        marginTop: hp('1%'),
    },
    progress: {
        height: hp('0.5%'),
        backgroundColor: '#85553A',
        borderRadius: 30,
    },
    iconContainer: {
        justifyContent: 'flex-end',
        height: '100%',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90%'),
        alignSelf: 'center',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1%'),
    },
    itemIconContainer: {
        backgroundColor: '#F7F7F7',
        borderRadius: 100,
        paddingHorizontal: wp('3%'),
        paddingVertical: wp('3%'),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        fontSize: wp('5.5%'),
        color: '#000',
        fontFamily: 'regular',
        marginLeft: wp('2.5%'),
    },
    itemsContainer: {
        backgroundColor: '#fff',
        width: wp('90%'),
        paddingVertical: hp('1%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
    },
    indicator: {
        marginTop: hp('5%'),
        marginBottom: hp('5%'),
    },
})
