import { useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import DefaultHeaderLeft from 'src/Components/Header/DefaultHeaderLeft'
import { S3Image } from 'src/Components/Shared/S3Image'
import AddCarPage from 'src/Screens/Car/AddCarPage'
import CreateVisitPage from 'src/Screens/Visit/CreateVisitPage'
import VisitsScreen from 'src/Screens/Visit/VisistsScreen'
import { useGetUserQuery } from 'src/Services/API'
import MyPropertyDetails from '../../Screens/Car/CarDetails'
import { headerTitleStyle } from '../../Screens/Service/HeaderTitleStyle'
import { useTranslation } from '../../Services/hooks/useTranslation'

const VisitStack = createNativeStackNavigator()

export default function VisitStackScreen() {
    const { translate } = useTranslation()
    const { data: user } = useGetUserQuery({})
    const [isAdmin, setIsAdmin] = useState(false)
    const navigation = useNavigation()
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
                        headerRight: () => (
                            <Pressable
                                onPress={() => {
                                    //@ts-ignore
                                    navigation.navigate('ProfileStack', { screen: 'ProfileModal' })
                                }}>
                                <S3Image
                                    file={undefined}
                                    folder={'users/images'}
                                    customStyle={{
                                        width: 32.5,
                                        height: 32.5,
                                        marginRight: 10,
                                        borderRadius: 50,
                                        borderWidth: 1,
                                        borderColor: '#F2F2F2',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                />
                            </Pressable>
                        ),

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
