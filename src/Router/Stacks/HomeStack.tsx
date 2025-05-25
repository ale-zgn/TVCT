import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../../Screens/Home/HomeScreen'

import React from 'react'
import DefaultHeader from '../../Components/Header/DefaultHeader'
import MyPropertyDetails from '../../Screens/Property/MyPropertyDetails'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'
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
                name='MyPropertiesDetails'
                component={MyPropertyDetails}
                options={{
                    headerShown: false,
                    headerTitleAlign: 'center',
                }}
            />
        </HomeStack.Navigator>
    )
}
