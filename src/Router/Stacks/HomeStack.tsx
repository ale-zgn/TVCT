import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../../Screens/Home/HomeScreen'

import React from 'react'
import DefaultHeader from '../../Components/Header/DefaultHeader'
import DefaultHeaderLeft from '../../Components/Header/DefaultHeaderLeft'
import MyPropertyDetails from '../../Screens/Car/CarDetails'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'
import CreateVisitPage from '../../Screens/Visit/CreateVisitPage'
import { useTabStyle } from '../../Services/hooks/NavigationTabStyle'
import { useTranslation } from '../../Services/hooks/useTranslation'

const HomeStack = createNativeStackNavigator()

export default function HomeStackScreen() {
    useTabStyle()

    const { translate } = useTranslation()
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={{
                    headerRight: () => <DefaultHeader />,
                    headerTitleStyle: headerTitleStyle,
                    title: translate('Home'),
                    headerShadowVisible: false,
                    headerTitleAlign: 'center',
                }}
            />
            <HomeStack.Screen
                name='MyCarDetails'
                component={MyPropertyDetails}
                options={{
                    headerShown: false,
                    headerTitleAlign: 'center',
                }}
            />
            <HomeStack.Screen
                name='NewVisitScreen'
                component={CreateVisitPage}
                options={{
                    title: translate('New visit'),
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                    headerLeft: () => <DefaultHeaderLeft />,
                }}
            />
        </HomeStack.Navigator>
    )
}
