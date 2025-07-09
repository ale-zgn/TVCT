import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import DefaultHeaderLeft from 'src/Components/Header/DefaultHeaderLeft'
import AddCarPage from 'src/Screens/Car/AddCarPage'
import CreateVisitPage from 'src/Screens/Visit/CreateVisitPage'
import MyPropertyDetails from '../../Screens/Car/CarDetails'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'
import { useTabStyle } from '../../Services/hooks/NavigationTabStyle'
import { useTranslation } from '../../Services/hooks/useTranslation'

const VisitUnloggedStack = createNativeStackNavigator()

export default function VisitUnloggedStackScreen() {
    const { translate } = useTranslation()
    useTabStyle()

    return (
        <VisitUnloggedStack.Navigator>
            <VisitUnloggedStack.Screen
                name='NewVisit'
                component={CreateVisitPage}
                options={{
                    title: translate('New visit'),
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
            <VisitUnloggedStack.Screen
                name='MyCarDetails'
                component={MyPropertyDetails}
                options={{
                    headerShown: false,
                    headerTitleAlign: 'center',
                }}
            />
            <VisitUnloggedStack.Screen
                name='AddCarPage'
                component={AddCarPage}
                options={{
                    headerLeft: () => <DefaultHeaderLeft />,
                    title: `${translate('Add car')}`,
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
        </VisitUnloggedStack.Navigator>
    )
}
