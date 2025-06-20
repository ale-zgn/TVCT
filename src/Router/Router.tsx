import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'

import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { Asset } from 'expo-asset'

import * as LinkingExpo from 'expo-linking'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute, NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as SecureStore from 'expo-secure-store'
import { TabHomeIcon, TabPropertyIcon, TabServiceIcon } from '../../assets/svgs/TabSvg'
import CloseHeaderLeft from '../Components/Header/CloseHeaderLeft'
import DefaultHeaderLeft from '../Components/Header/DefaultHeaderLeft'
import { headerTitleStyle } from '../Screens/Service/HeaderTitleStyle'
import HomeStack from './Stacks/HomeStack'
import MyPropertyStack from './Stacks/MyPropertyStack'
import ServiceStack from './Stacks/ServiceStack'

import { useSharedValue } from 'react-native-reanimated'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Video } from 'expo-av'
import LanguageModal from '../Screens/Modals/LanguageModal'
import PersonalInformationModal from '../Screens/Modals/PersonalInformationModal'
import ProfileModal from '../Screens/Modals/ProfileModal'
import { useTranslation } from '../Services/hooks/useTranslation'
import LoginUnloggedStackScreen from './Stacks/LoginUnloggedStack'
import VisitStack from './Stacks/VisitStack'
import VisitUnloggedStackScreen from './Stacks/VisitStackUnlogged'
SplashScreen.preventAutoHideAsync()

const RootStack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()
const TabUnlogged = createBottomTabNavigator()

const Profile = createNativeStackNavigator()
const Login = createNativeStackNavigator()

function ProfileStack() {
    const { translate } = useTranslation()
    return (
        <Profile.Navigator>
            <Profile.Screen
                name='ProfileModal'
                component={ProfileModal}
                options={{
                    headerLeft: () => <CloseHeaderLeft />,
                    title: `${translate('Profile')}`,
                    presentation: 'fullScreenModal',
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />

            <Profile.Screen
                name='PersonalInformationsModal'
                component={PersonalInformationModal}
                options={{
                    headerLeft: () => <DefaultHeaderLeft />,
                    title: `${translate('Personal informations')}`,
                    presentation: 'card',
                    headerTitleStyle: headerTitleStyle,
                    headerTitleAlign: 'center',
                }}
            />

            <Profile.Screen
                name='LanguageModal'
                component={LanguageModal}
                options={{
                    headerLeft: () => <DefaultHeaderLeft />,
                    title: 'Language',
                    headerTitleStyle: headerTitleStyle,
                    presentation: 'transparentModal',
                    headerShown: false,
                    animation: 'fade',
                    headerTitleAlign: 'center',
                }}
            />
        </Profile.Navigator>
    )
}

function TabBarLabel({ route, color, opacity }: { route: string; color?: string; opacity: number }) {
    const { translate } = useTranslation()
    return (
        <Text
            style={{
                opacity: opacity,
                color: color,
                fontSize: hp('2%'),
                fontFamily: 'regular',
                marginBottom: hp('0.85%'),
            }}>
            {translate(`${route}`)}
        </Text>
    )
}

function TabNavigator() {
    const tabHiddenScreens = ['CreateAccount', 'TutorialPage', 'PrivacyPolicy', 'Contact', 'FAQ', 'PropertyDetails', 'MyPropertiesDetails', 'AddCarPage']

    const getTabBarStyle = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? route.name
        console.log('routeName', routeName)

        if (tabHiddenScreens.includes(routeName)) {
            console.log('eeee')

            return { display: 'none', height: 0 }
        }
        return {
            display: 'flex',
            height: hp('10%'),
            position: 'absolute',
        }
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                lazy: false,
                headerShown: false,
                tabBarStyle: getTabBarStyle(route),
                tabBarItemStyle: {
                    marginTop: 8,
                    height: hp('8%'),
                },
                tabBarIcon: ({ focused }) => {
                    switch (route.name) {
                        case 'HomeStack':
                            return <TabHomeIcon color={focused ? '#0D47A1' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'MyPropertyStack':
                            return <TabPropertyIcon color={focused ? '#0D47A1' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'SearchStack':
                            return <FontAwesome6 name='screwdriver-wrench' size={20} color={focused ? '#0D47A1' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'ServiceStack':
                            return <TabServiceIcon color={focused ? '#0D47A1' : '#666666'} opacity={focused ? 1 : 0.5} />
                        default:
                            return null
                    }
                },
                tabBarLabel: ({ focused }) => {
                    switch (route.name) {
                        case 'HomeStack':
                            return <TabBarLabel route='Home' color={focused ? '#0D47A1' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'MyPropertyStack':
                            return <TabBarLabel route='Vehicules' color={focused ? '#0D47A1' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'SearchStack':
                            return <TabBarLabel route='Visits' color={focused ? '#0D47A1' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'ServiceStack':
                            return <TabBarLabel route='Services' color={focused ? '#0D47A1' : '#666666'} opacity={focused ? 1 : 0.5} />
                        default:
                            return null
                    }
                },
                tabBarInactiveTintColor: '#666666',
                tabBarActiveTintColor: 'black',
            })}
            sceneContainerStyle={{ overflow: 'visible' }}>
            <Tab.Screen name='HomeStack' component={HomeStack} />
            <Tab.Screen name='MyPropertyStack' component={MyPropertyStack} />
            <Tab.Screen name='SearchStack' component={VisitStack} />
            <Tab.Screen name='ServiceStack' component={ServiceStack} />
        </Tab.Navigator>
    )
}

function TabNavigatorUnlogged() {
    const tabHiddenScreens = ['CreateAccount', 'TutorialPage', 'PrivacyPolicy', 'Contact', 'FAQ', 'PropertyDetails', 'MyPropertiesDetails', 'AddCarPage']

    const getTabBarStyle = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? route.name
        console.log('routeName', routeName)

        if (tabHiddenScreens.includes(routeName)) {
            return { display: 'none', height: 0 }
        }
        return {
            display: 'flex',
            height: hp('10%'),
            position: 'absolute',
        }
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                lazy: false,
                headerShown: false,
                tabBarStyle: getTabBarStyle(route),
                tabBarItemStyle: {
                    marginTop: 8,
                    height: hp('8%'),
                },
                tabBarIcon: ({ focused }) => {
                    switch (route.name) {
                        case 'LoginStack':
                            return <MaterialCommunityIcons name='login' size={20} color={focused ? 'black' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'VisitStack':
                            return <FontAwesome6 name='screwdriver-wrench' size={20} color={focused ? 'black' : '#666666'} opacity={focused ? 1 : 0.5} />

                        default:
                            return null
                    }
                },
                tabBarLabel: ({ focused }) => {
                    switch (route.name) {
                        case 'LoginStack':
                            return <TabBarLabel route='login' opacity={focused ? 1 : 0.5} />
                        case 'VisitStack':
                            return <TabBarLabel route='Visit' opacity={focused ? 1 : 0.5} />

                        default:
                            return null
                    }
                },
                tabBarInactiveTintColor: '#666666',
                tabBarActiveTintColor: 'black',
            })}
            sceneContainerStyle={{ overflow: 'visible' }}>
            <Tab.Screen name='LoginStack' component={LoginUnloggedStackScreen} />
            <Tab.Screen name='VisitStack' component={VisitUnloggedStackScreen} />
        </Tab.Navigator>
    )
}

export default function Router() {
    const navigationRef = useRef<null | NavigationContainerRef<{}>>(null)

    const [appAssetsLoaded, setAssetsAppLoaded] = useState(false)

    const opacity = useSharedValue(1)
    const { language: selectedLanguage } = useTranslation()

    const videoRef = useRef<Video>(null)

    const [isAuth, setIsAuth] = useState<boolean | null>(null)

    const [navigationScreen, setNavigationScreen] = useState({
        route: '',
        data: {},
    })

    const prefix = LinkingExpo.createURL('/')

    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            setIsAuth(token ? true : false)
        })
    }, [])

    useEffect(() => {
        Promise.all([
            Font.loadAsync({
                bold: require('../../assets/fonts/Creambelly-Bold.otf'),
                light: require('../../assets/fonts/29LTZaridSans-ExtraLight.otf'),
                italic: require('../../assets/fonts/Creambelly-Italic.otf'),
                medium: require('../../assets/fonts/29LTZaridSans-Medium.otf'),
                regular: require('../../assets/fonts/29LTZaridSans-Regular.otf'),
            }),

            Asset.fromModule(require('../../assets/intro.mp4')).downloadAsync(),
            Asset.fromModule(require('../../assets/splash.png')).downloadAsync(),
            Asset.fromModule(require('../../assets/images/TUTO..1.png')).downloadAsync(),
            Asset.fromModule(require('../../assets/images/TUTO..2.png')).downloadAsync(),
            Asset.fromModule(require('../../assets/images/PAYEMENT.png')).downloadAsync(),
            Asset.fromModule(require('../../assets/images/TUTTO.4.png')).downloadAsync(),
            // Asset.fromModule(require("../../assets/images/banner-nationalday.jpeg")).downloadAsync(),

            // Asset.fromModule(require('../assets/images//image2.png')).downloadAsync(),
        ]).then(() => {
            setAssetsAppLoaded(true)
        })
    }, [])

    useEffect(() => {
        if (navigationRef.current !== null && navigationScreen.route !== '') {
            //alert("navigate to homeScreen" + navigationRef.current + navigationScreen.route)
            //@ts-ignore
            navigationRef.current.navigate(isAuth ? 'TabNavigator' : 'TabNavigatorUnlogged')

            setNavigationScreen({
                route: '',
                data: {},
            })
        }
    }, [navigationScreen])

    const onLayoutRootView = useCallback(async () => {
        if (appAssetsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [appAssetsLoaded])

    if (!appAssetsLoaded || isAuth === null) {
        return null
    }

    return (
        <>
            <View onLayout={onLayoutRootView} style={[selectedLanguage === 'en' ? styles.ltr : styles.rtl, { flex: 1 }]}>
                <StatusBar barStyle='dark-content' />
                <NavigationContainer
                    ref={navigationRef}
                    linking={{
                        config: {
                            screens: {},
                        },
                        prefixes: [prefix],
                        // subscribe() {
                        //     alert("Linking subscription invoked")
                        //     return () => {
                        //         alert("Linking subscription cleaned up")
                        //     }
                        // },
                    }}>
                    <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isAuth ? 'TabNavigator' : 'TabNavigatorUnlogged'}>
                        <RootStack.Screen name='LoginStack' component={LoginUnloggedStackScreen} />

                        <RootStack.Screen name='TabNavigatorUnlogged' component={TabNavigatorUnlogged} />

                        <RootStack.Screen name='TabNavigator' component={TabNavigator} />

                        <RootStack.Group
                            screenOptions={{
                                presentation: 'fullScreenModal',
                            }}>
                            <RootStack.Screen name='ProfileStack' component={ProfileStack} />
                        </RootStack.Group>
                    </RootStack.Navigator>
                </NavigationContainer>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    rtl: {
        direction: 'rtl',
    },
    ltr: {
        direction: 'ltr',
    },
})
