import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import DefaultHeaderLeft from 'src/Components/Header/DefaultHeaderLeft'
import AddCarPage from 'src/Screens/Property/AddCarPage'
import CreateVisitPage from 'src/Screens/Visit/CreateVisitPage'
import VisitsScreen from 'src/Screens/Visit/VisistsScreen'
import { useGetUserQuery } from 'src/Services/API'
import MyPropertyDetails from '../../Screens/Property/MyPropertyDetails'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'
import { useTranslation } from '../../Services/hooks/useTranslation'

const VisitStack = createNativeStackNavigator()

export default function VisitStackScreen() {
    const { translate } = useTranslation()
    const { data: user } = useGetUserQuery({})
    const [isAdmin, setIsAdmin] = useState(false)
    useEffect(() => {
        if (user && user.role === 0) {
            setIsAdmin(true)
        }
    }, [user])

    return (
        <VisitStack.Navigator>
            {isAdmin ? (
                <VisitStack.Screen
                    name='VisitsScreen'
                    component={VisitsScreen}
                    options={{
                        title: translate('Visits'),
                        headerTitleStyle: headerTitleStyle,
                        headerTitleAlign: 'center',
                    }}
                />
            ) : (
                <VisitStack.Screen
                    name='NewVisit'
                    component={CreateVisitPage}
                    options={{
                        title: translate('New visit'),
                        headerTitleStyle: headerTitleStyle,
                        headerTitleAlign: 'center',
                        headerLeft: () => <DefaultHeaderLeft />,
                    }}
                />
            )}

            <VisitStack.Screen
                name='MyCarDetails'
                component={MyPropertyDetails}
                options={{
                    headerShown: false,
                    headerTitleAlign: 'center',
                }}
            />

            <VisitStack.Screen
                name='AddCarPage'
                component={AddCarPage}
                options={{
                    headerLeft: () => <DefaultHeaderLeft />,
                    title: translate('Add car'),
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
        </VisitStack.Navigator>
    )
}
