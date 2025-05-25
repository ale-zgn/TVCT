import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'

import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { Asset } from 'expo-asset'

import * as LinkingExpo from 'expo-linking'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as SecureStore from 'expo-secure-store'
import { TabDocumentIcon, TabHomeIcon, TabPropertyIcon, TabSearchIcon, TabServiceIcon } from '../../assets/svgs/TabSvg'
import CloseHeaderLeft from '../Components/Header/CloseHeaderLeft'
import DefaultHeaderLeft from '../Components/Header/DefaultHeaderLeft'
import { headerTitleStyle } from '../Screens/Service/HeaderTitleStyle'
import HomeStack from './Stacks/HomeStack'
import MyPropertyStack from './Stacks/MyPropertyStack'
import SearchStack from './Stacks/SearchStack'
import ServiceStack from './Stacks/ServiceStack'

import { useSharedValue } from 'react-native-reanimated'

import { ResizeMode, Video } from 'expo-av'
import VideoPlayer from '../Components/Shared/VideoPlayer'
import LanguageModal from '../Screens/Modals/LanguageModal'
import PersonalInformationModal from '../Screens/Modals/PersonalInformationModal'
import ProfileModal from '../Screens/Modals/ProfileModal'
import { useTranslation } from '../Services/hooks/useTranslation'
import HomeStackUnloggedScreen from './Stacks/HomeUnloggedStack'
import LoginUnloggedStackScreen from './Stacks/LoginUnloggedStack'

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
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                //@ts-ignore
                lazy: false,
                headerShown: false,
                tabBarStyle: {
                    display: 'flex',
                },
                tabBarItemStyle: {
                    marginTop: 8,
                    height: hp('8%'),
                },

                tabBarIcon: ({ focused }) => {
                    switch (route.name) {
                        case 'HomeStack':
                            return <TabHomeIcon color={focused ? 'black' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'MyPropertyStack':
                            return <TabPropertyIcon color={focused ? 'black' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'SearchStack':
                            return <TabSearchIcon color={focused ? 'black' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'DocumentStack':
                            return <TabDocumentIcon color={focused ? 'black' : '#666666'} opacity={focused ? 1 : 0.5} />
                        case 'ServiceStack':
                            return <TabServiceIcon color={focused ? 'black' : '#666666'} opacity={focused ? 1 : 0.5} />
                        default:
                            break
                    }
                },
                tabBarInactiveTintColor: '#666666',
                tabBarActiveTintColor: 'black',
                tabBarLabel: ({ focused }) => {
                    switch (route.name) {
                        case 'HomeStack':
                            return <TabBarLabel route='Home' opacity={focused ? 1 : 0.5} />
                        case 'MyPropertyStack':
                            return <TabBarLabel route='Properties' opacity={focused ? 1 : 0.5} />
                        case 'SearchStack':
                            return <TabBarLabel route='Search' opacity={focused ? 1 : 0.5} />
                        case 'DocumentStack':
                            return <TabBarLabel route='Documents' opacity={focused ? 1 : 0.5} />
                        case 'ServiceStack':
                            return <TabBarLabel route='Services' opacity={focused ? 1 : 0.5} />
                        default:
                            break
                    }
                },
            })}
            sceneContainerStyle={{ overflow: 'visible' }}>
            <Tab.Screen
                name='HomeStack'
                options={{
                    headerShadowVisible: false,
                }}
                component={HomeStack}
            />
            <Tab.Screen name='MyPropertyStack' component={MyPropertyStack} />
            <Tab.Screen name='SearchStack' component={SearchStack} />

            <Tab.Screen name='ServiceStack' component={ServiceStack} />
        </Tab.Navigator>
    )
}

export default function Router() {
    const navigationRef = useRef<null | NavigationContainerRef<{}>>(null)

    const [appAssetsLoaded, setAssetsAppLoaded] = useState(false)

    const [isVideoVisible, setIsVideoVisible] = useState(true)
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

    const onVideoEnd = () => {
        setIsVideoVisible(false)
    }

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
            <VideoPlayer
                showLoader={false}
                source={require('../../assets/intro.mp4')}
                isVisible={isVideoVisible}
                onVideoEnd={onVideoEnd}
                isMuted={true}
                resizeMode={ResizeMode.COVER}
            />

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

                        <RootStack.Screen name='TabNavigatorUnlogged' component={HomeStackUnloggedScreen} />

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
