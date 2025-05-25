import { useNavigation, useRoute } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DefaultHeader from '../../Components/Header/DefaultHeader'
import DefaultHeaderLeft from '../../Components/Header/DefaultHeaderLeft'
import FAQScreen from '../../Screens/Service/FAQ/FAQScreen'
import PrivacyPolicyScreen from '../../Screens/Service/Privacy Policy/PrivacyPolicyScreen'
import ServicesScreen from '../../Screens/Service/ServicesScreen'
import { useTabStyle } from '../../Services/hooks/NavigationTabStyle'

import { useTranslation } from '../../Services/hooks/useTranslation'

import React from 'react'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'

const ServiceStack = createNativeStackNavigator()
const OptionStack = createNativeStackNavigator()
const AppointmentOptionStack = createNativeStackNavigator()

export default function ServiceStackScreen() {
    useTabStyle()

    const navigation = useNavigation()
    const route = useRoute()
    const { translate } = useTranslation()

    // useLayoutEffect(() => {
    //     const tabHiddenRoutes = ['CreateAccount','AppointmentsSurvey','LoginLastSteps','TutorialPage','VerifyNumber','RewardsDetails','Rewards','Contact','FAQ','ReferAFriend','Warranty','PaymentDetails','PaymentScreen','AppointmentsNew','AppointmentsDetails','Appointments','ReportAProblem','CancelTicket','SearchPropertyDetails','SearchFilter','PropertyDetails','Options','TicketDetails','RaiseATicket', 'SearchPropertyDetails', 'SearchFilter', 'DocumentsRead', 'MyPropertiesDetails'];

    //     if(tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route)!)){

    //         navigation.getParent()?.setOptions({
    //             headerTitleAlign: 'center',

    //             tabBarStyle: {
    //                 display: 'none',
    //                 height: 0,
    //                 paddingBottom: 0,
    //             },
    //         });
    //         navigation.setOptions(
    //         {
    //             headerTitleAlign: 'center',
    //             tabBarStyle: {
    //                 display: 'none',
    //                 height: 0,
    //                 paddingBottom: 0,
    //             },
    //             headerShadowVisible: false,
    //             headerTitleStyle: {
    //                 fontFamily: 'medium',
    //                 fontSize: wp('14.5%'),
    //                 color: 'red',
    //                 borderBottomWidth: 0,
    //             }
    //         });
    //     } else {
    //         navigation.setOptions({
    //             headerTitleAlign: 'center',

    //             tabBarStyle: {
    //                 display: 'flex',
    //                 height: hp('10%'),
    //             },
    //         headerShadowVisible: false,

    //             headerTitleStyle: {
    //                 fontFamily: 'medium',
    //                 fontSize: wp('14.5%'),
    //                 color: 'red',
    //                 borderBottomWidth: 0,
    //             },
    //             // headerShadowVisible: false,
    //             headerStyle: {
    //                 borderBottomWidth: 0,
    //             },
    //         });
    //     }
    // }, [navigation,route])

    return (
        <ServiceStack.Navigator>
            <ServiceStack.Screen
                name='Services'
                component={ServicesScreen}
                options={{
                    headerRight: () => <DefaultHeader />,
                    headerTitleStyle: headerTitleStyle,
                    title: `${translate('Services')}`,
                    headerShadowVisible: false,
                    headerTitleAlign: 'center',
                }}
            />
            <ServiceStack.Screen
                name='FAQ'
                component={FAQScreen}
                options={{
                    headerLeft: () => <DefaultHeaderLeft />,
                    title: `${translate('FAQ')}`,
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />

            <ServiceStack.Screen
                name='PrivacyPolicy'
                component={PrivacyPolicyScreen}
                options={{
                    headerLeft: () => <DefaultHeaderLeft />,
                    title: `${translate('Privacy Policy')}`,
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
        </ServiceStack.Navigator>
    )
}
