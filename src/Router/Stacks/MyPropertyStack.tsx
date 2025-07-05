import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import DefaultHeaderLeft from 'src/Components/Header/DefaultHeaderLeft'
import AddCarPage from 'src/Screens/Property/AddCarPage'
import CreateVisitPage from 'src/Screens/Visit/CreateVisitPage'
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
                    title: translate('My Cars'),
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
            <PropertyStack.Screen
                name='NewVisitScreen'
                component={CreateVisitPage}
                options={{
                    title: translate('New visit'),
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                    headerLeft: () => <DefaultHeaderLeft />,
                }}
            />
            <PropertyStack.Screen
                name='MyCarDetails'
                component={MyPropertyDetails}
                options={{
                    headerShown: false,
                    headerTitleAlign: 'center',
                }}
            />
            <PropertyStack.Screen
                name='AddCarPage'
                component={AddCarPage}
                options={{
                    headerLeft: () => <DefaultHeaderLeft />,
                    title: `${translate('Add car')}`,
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
        </PropertyStack.Navigator>
    )
}
