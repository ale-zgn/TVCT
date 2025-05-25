import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import { hp, wp } from './ResponsivePercentage'

export const useTabStyle = (props?: any) => {
    const fontSize = wp(14.5)
    console.log('Computed fontSize:', fontSize)

    const navigation = useNavigation()
    const route = useRoute()
    const tabHiddenRoutes = [
        'CreateAccount',
        'AppointmentsSurvey',
        'LoginLastSteps',
        'TutorialPage',
        'VerifyNumber',
        'RewardsDetails',
        'PrivacyPolicy',
        'Rewards',
        'Contact',
        'FAQ',
        'ReferAFriend',
        'Warranty',
        'PaymentDetails',
        'PaymentScreen',
        'AppointmentsNew',
        'AppointmentsDetails',
        'Appointments',
        'ReportAProblem',
        'CancelTicket',
        'SearchPropertyDetails',
        'SearchFilter',
        'PropertyDetails',
        'Options',
        'TicketDetails',
        'RaiseATicket',
        'SearchPropertyDetails',
        'SearchFilter',
        'DocumentsRead',
        'MyPropertiesDetails',
        'RateSalesTeamModal',
        'FavoritProperty',
        'FavoritProperty2',
        'RaiseANewTicket',
        'HomeSearchPropertyDetails',
        'HomeNFAnnoucementScreen',
    ]

    useLayoutEffect(() => {
        console.log('getFocusedRouteNameFromRoute', getFocusedRouteNameFromRoute(route))

        if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route)!)) {
            navigation.getParent()?.setOptions({
                headerTitleAlign: 'center',

                tabBarStyle: {
                    display: 'none',
                    height: 0,
                    paddingBottom: 0,
                },
            })
            navigation.setOptions({
                headerTitleAlign: 'center',
                tabBarStyle: {
                    display: 'none',
                    height: 0,
                    paddingBottom: 0,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                    fontFamily: 'medium',
                    fontSize: wp(14.5),
                    color: 'red',
                    borderBottomWidth: 0,
                },
            })
        } else {
            navigation.setOptions(
                props
                    ? props
                    : {
                          headerTitleAlign: 'center',

                          tabBarStyle: {
                              position: 'absolute', //Here is the trick
                              display: 'flex',
                              height: hp(10),
                          },
                          headerShadowVisible: false,

                          headerTitleStyle: {
                              fontFamily: 'medium',
                              fontSize: wp(14.5),
                              color: 'red',
                              borderBottomWidth: 0,
                          },
                          // headerShadowVisible: false,
                          headerStyle: {
                              borderBottomWidth: 0,
                          },
                      }
            )
        }
    }, [navigation, route])
}
