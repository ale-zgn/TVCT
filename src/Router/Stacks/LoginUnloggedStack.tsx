import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import LoginPage from '../../Screens/Login/LoginPage'
import { useTabStyle } from '../../Services/hooks/NavigationTabStyle'

import DefaultHeaderLeft from '../../Components/Header/DefaultHeaderLeft'
import CreateAccountPage from '../../Screens/Login/CreateAccountPage'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'
import { useTranslation } from '../../Services/hooks/useTranslation'

const LoginUnloggedStack = createNativeStackNavigator()

export default function LoginUnloggedStackScreen() {
    useTabStyle()
    const { translate } = useTranslation()

    return (
        <LoginUnloggedStack.Navigator screenOptions={{}}>
            <LoginUnloggedStack.Screen
                name='LoginScreen'
                component={LoginPage}
                options={{
                    title: `${translate('My Account')}`,
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
            <LoginUnloggedStack.Screen
                name='CreateAccount'
                component={CreateAccountPage}
                options={{
                    headerLeft: () => <DefaultHeaderLeft />,
                    title: `${translate('Create an account')}`,
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />
        </LoginUnloggedStack.Navigator>
    )
}
