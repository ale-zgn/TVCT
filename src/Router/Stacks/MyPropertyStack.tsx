import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import DefaultHeader from '../../Components/Header/DefaultHeader'
import MyPropertyDetails from '../../Screens/Property/MyPropertyDetails'
import MyPropertiesScreen from '../../Screens/Property/PropertyScreen'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'
import { useTabStyle } from '../../Services/hooks/NavigationTabStyle'
import { useTranslation } from '../../Services/hooks/useTranslation'

const PropertyStack = createNativeStackNavigator()

export default function PropertyStackScreen() {
    const { translate } = useTranslation()
    useTabStyle()

    return (
        <PropertyStack.Navigator>
            <PropertyStack.Screen
                name='MyProperties'
                component={MyPropertiesScreen}
                options={{
                    headerRight: () => <DefaultHeader />,
                    title: translate('My Properties'),
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
            <PropertyStack.Screen
                name='MyPropertiesDetails'
                component={MyPropertyDetails}
                options={{
                    headerShown: false,
                    headerTitleAlign: 'center',
                }}
            />
        </PropertyStack.Navigator>
    )
}
