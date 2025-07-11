import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import DefaultHeaderLeft from '../../Components/Header/DefaultHeaderLeft'
import AddCarPage from '../../Screens/Car/AddCarPage'
import CentersScreen from '../../Screens/Center/CentersScreen'
import CreateCenterPage from '../../Screens/Center/CreateCenterScreen'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'
import { useTabStyle } from '../../Services/hooks/NavigationTabStyle'
import { useTranslation } from '../../Services/hooks/useTranslation'

const CenterStack = createNativeStackNavigator()

export default function CenterStackScreen() {
    const { translate } = useTranslation()
    const isAdmin = false // Replace with your actual logic
    useTabStyle()

    return (
        <CenterStack.Navigator>
            <CenterStack.Screen
                name='CentersScreen'
                component={CentersScreen}
                options={{
                    title: translate('Centers'),
                    headerLeft: () => <DefaultHeaderLeft />,

                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />

            <CenterStack.Screen
                name='NewCenterScreen'
                component={CreateCenterPage}
                options={{
                    title: translate('Add center'),
                    headerLeft: () => <DefaultHeaderLeft />,

                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />

            <CenterStack.Screen
                name='AddCarPage'
                component={AddCarPage}
                options={{
                    headerLeft: () => <DefaultHeaderLeft />,
                    title: translate('Add car'),
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
        </CenterStack.Navigator>
    )
}
