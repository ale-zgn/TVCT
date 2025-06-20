import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import DefaultHeader from '../../Components/Header/DefaultHeader'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'
import { useTabStyle } from '../../Services/hooks/NavigationTabStyle'
import { useTranslation } from '../../Services/hooks/useTranslation'
const SearchStack = createNativeStackNavigator()

export default function SearchStackScreen() {
    useTabStyle()
    const { translate } = useTranslation()

    return (
        <SearchStack.Navigator>
            <SearchStack.Screen
                name='Search'
                component={SearchScreen}
                options={{
                    headerRight: () => <DefaultHeader />,
                    headerTitleStyle: headerTitleStyle,
                    title: `${translate('Search')}`,
                    headerShadowVisible: false,
                    headerTitleAlign: 'center',
                }}
            />
        </SearchStack.Navigator>
    )
}
