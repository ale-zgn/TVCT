import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import React from 'react'
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useGetNotificationsQuery } from 'src/Services/API'
import useSocket from '../../Services/hooks/useSocket'
import { useTranslation } from '../../Services/hooks/useTranslation'
const mockNotifications = [
    {
        id: 1,
        title: 'New Visit Scheduled',
        location: 'Tunis',
        location_id: 101,
        location_title: 'Inspection Center - Tunis',
        sub_location: 'Zone A',
        sub_location_id: 201,
        sub_location_title: 'Bay 1',
        is_opened: false,
        entity_id: 501,
        created_for_user_id: 1001,
        created_by_user_id: 2001,
        created_at: new Date('2025-06-25T10:30:00Z'),
        updated_at: new Date('2025-06-25T10:30:00Z'),
        deleted_at: null,
    },
    {
        id: 2,
        title: 'Car Inspection Result Ready',
        location: 'Sfax',
        location_id: 102,
        location_title: 'Inspection Center - Sfax',
        sub_location: 'Zone B',
        sub_location_id: 202,
        sub_location_title: 'Bay 2',
        is_opened: true,
        entity_id: 502,
        created_for_user_id: 1002,
        created_by_user_id: 2002,
        created_at: new Date('2025-06-20T08:45:00Z'),
        updated_at: new Date('2025-06-21T09:00:00Z'),
        deleted_at: null,
    },
    {
        id: 3,
        title: 'Reminder: Visit Tomorrow',
        location: 'Sousse',
        location_id: 103,
        location_title: 'Inspection Center - Sousse',
        sub_location: 'Zone C',
        sub_location_id: 203,
        sub_location_title: 'Bay 3',
        is_opened: false,
        entity_id: 503,
        created_for_user_id: 1003,
        created_by_user_id: 2003,
        created_at: new Date('2025-07-01T14:20:00Z'),
        updated_at: new Date('2025-07-01T14:20:00Z'),
        deleted_at: null,
    },
]

export default function NotificationModal() {
    const { data: notifications, refetch: notificationsRefetch } = useGetNotificationsQuery()

    useSocket({
        onReactive: async (event) => {
            if (event.model === 'UserNotification') {
                notificationsRefetch()
            }
        },
    })

    return (
        <View style={styles.wrapper}>
            <FlatList
                data={notifications}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return <NotificationItem notification={item} />
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 15 }}
                ListEmptyComponent={
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                        }}>
                        <Text style={{ fontSize: wp('4.5%'), fontFamily: 'regular', color: 'black' }}>No notifications found</Text>
                    </View>
                }
            />
        </View>
    )
}

function NotificationItem({ notification }) {
    const navigation = useNavigation()
    const { translate, language } = useTranslation()
    const translatedDate = `${moment(notification.created_at).locale('en').format('dddd')} ${moment(notification.created_at).locale('en').format('HH:mm a')}`

    return (
        <View>
            <Pressable
                style={styles.itemContainer}
                onPress={async () => {
                    /*    if (!notification.is_opened) {
                        await openUserNotification(notification.id)
                    }

                    if (notification.location === 'HandoverAnnouncement') {
                        //@ts-ignore
                        navigation.navigate('HomeSearchPropertyDetails', {
                            property_api: properties?.find((property: WPProperty) => {
                                return property?.acf?.project_name === 'Nesaj Town AlFursan'
                            }),
                            showVideo: true,
                        })
                    } else {
                        navigation.navigate(route, data)
                    } */
                }}>
                {!notification.is_opened && <View style={styles.unreadLeft} />}
                <View style={styles.itemLeft}>
                    <Image source={require('../../../assets/splash-icon.png')} style={styles.itemImage} />
                    {!notification.is_opened && <View style={styles.unreadDot} />}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: wp('80%') }}>
                    <View style={styles.itemRight}>
                        <Text style={styles.itemTitle}>
                            {(() => {
                                let title = translate(notification.location)

                                if (title === 'HandoverAnnouncement') {
                                    title = 'عـــــــام قبل الوعد'
                                }

                                return title
                            })()}
                            {notification.location === 'Ticket' &&
                                (language === 'ar' ? `\u202A#${notification.location_title}` : `#${notification.location_title}`)}
                        </Text>
                        <Text style={styles.itemDate}>{translatedDate}</Text>
                        <Text style={styles.itemDescription}>{notification.title}</Text>
                    </View>
                </View>
            </Pressable>
            <View style={styles.itemSeparator} />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        paddingTop: wp('3%'),
    },
    sectionHeader: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        marginVertical: hp('1%'),
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: wp('100%'),
        alignItems: 'center',
    },
    itemLeft: {
        flexDirection: 'row',
    },
    itemImage: {
        width: 40,
        height: 40,
        resizeMode: 'stretch',
        borderRadius: 5,
    },
    itemRight: {
        marginLeft: 10,
        width: wp('55%'),
    },
    itemTitle: {
        alignSelf: 'flex-start',
        fontSize: wp('4.5%'),
        fonttFamily: 'medium',
        color: '#121212',
    },
    itemDescription: {
        fontSize: wp('4.25%'),
        alignSelf: 'flex-start',
        fontFamily: 'medium',
        color: '#666666',
        marginTop: 5,
        textAlign: 'left',
    },
    itemDate: {
        fontSize: wp('3.75%'),
        fontFamily: 'medium',
        marginTop: 5,
        color: '#666666',
        textAlign: 'left',
    },
    answerButton: {
        backgroundColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    answerButtonText: {
        color: '#fff',
        fontSize: wp('4%'),
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginVertical: hp('3.25%'),
    },
    unreadDot: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: 50,
        backgroundColor: '#0D47A1',
        position: 'absolute',
        top: hp('5%'),
        right: wp('-1%'),
        borderWidth: 3,
        borderColor: '#fff',
    },
    unreadLeft: {
        width: wp('3.5%'),
        height: hp('5%'),
        backgroundColor: '#0D47A1',
        position: 'absolute',
        left: wp('-6.25%'),
    },
})
