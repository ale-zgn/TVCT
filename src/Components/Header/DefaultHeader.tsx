import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useSocket from 'src/Services/hooks/useSocket'
import { NotificationIcon } from '../../../assets/svgs/Svg'
import { useGetNotificationsQuery } from '../../Services/API'
import { S3Image } from '../Shared/S3Image'

export default function DefaultHeader() {
    const navigation = useNavigation()
    const { data: notifications, refetch: notificationsRefetch } = useGetNotificationsQuery()

    const [notificationCount, setNotificationCount] = useState(0)
    const [surveyCount, setSurveyCount] = useState(0)

    useEffect(() => {
        let count = 0
        notifications?.forEach((notification) => {
            if (!notification.is_opened) {
                count++
            }
        })
        setNotificationCount(count)
    }, [notifications])

    useSocket({
        onReactive: async (event) => {
            if (event.model === 'UserNotification') {
                notificationsRefetch()
            }
        },
    })

    return (
        <View style={styles.Container}>
            <Pressable
                style={styles.IconContainer}
                onPress={() => {
                    //@ts-ignore
                    navigation.navigate('ProfileStack', { screen: 'NotificationModal' })
                }}>
                <NotificationIcon />
                {(notificationCount > 0 || surveyCount > 0) && (
                    <View style={styles.notificationIcon}>
                        <Text style={{ color: 'white', fontSize: wp('2%'), alignSelf: 'center' }}>{notificationCount + surveyCount}</Text>
                    </View>
                )}
            </Pressable>
            <Pressable
                onPress={() => {
                    //@ts-ignore
                    navigation.navigate('ProfileStack', { screen: 'ProfileModal' })
                }}>
                <S3Image file={undefined} folder={'users/images'} customStyle={styles.image} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
    },
    IconContainer: {
        width: 32.5,
        height: 32.5,
        marginRight: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 32.5,
        height: 32.5,
        marginRight: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        width: 15,
        height: 10,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#0D47A1',
        borderRadius: 100,
    },
})
