import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useCallback } from 'react'
import { hp, wp } from './ResponsivePercentage'

// Use this hook directly in the screens that need to hide tabs
export const useHideTabs = () => {
    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            // Find the tab navigator
            let tabNavigator = navigation.getParent()

            // Hide tabs when screen is focused
            if (tabNavigator) {
                tabNavigator.setOptions({
                    tabBarStyle: { display: 'none' },
                })
            }

            // Show tabs when screen is unfocused (cleanup)
            return () => {
                if (tabNavigator) {
                    tabNavigator.setOptions({
                        tabBarStyle: {
                            position: 'absolute',
                            height: hp('10%', { showPixel: false }),
                        },
                    })
                }
            }
        }, [navigation])
    )
}

// Alternative: Enhanced version of your original hook
export const useTabStyle = (props?: any) => {
    const navigation = useNavigation()
    const route = useRoute()
    const tabHiddenRoutes = ['CreateAccount', 'TutorialPage', 'PrivacyPolicy', 'Contact', 'FAQ', 'PropertyDetails', 'MyPropertiesDetails', 'AddCarPage']

    useFocusEffect(
        useCallback(() => {
            // Get the current screen name from navigation state
            const state = navigation.getState()
            console.log('Full navigation state:', JSON.stringify(state, null, 2))

            // Navigate through the state to find the current screen
            let currentRoute = state.routes[state.index]
            console.log('Current tab route:', currentRoute.name)

            const shouldHideTabs = tabHiddenRoutes.includes(currentRoute.name)
            console.log('Should hide tabs:', shouldHideTabs)

            if (shouldHideTabs) {
                // Hide tabs
                navigation.getParent()?.setOptions({
                    tabBarStyle: { display: 'none' },
                })

                navigation.setOptions({
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        fontFamily: 'medium',
                        fontSize: wp('14.5%', { showPixel: false }),

                        borderBottomWidth: 0,
                    },
                })
            } else {
                // Show tabs
                navigation.getParent()?.setOptions({
                    tabBarStyle: {
                        marginTop: 8,
                        height: hp('10%', { showPixel: false }),
                    },
                })

                navigation.setOptions(
                    props || {
                        headerTitleAlign: 'center',
                        headerShadowVisible: false,
                        headerTitleStyle: {
                            fontFamily: 'medium',
                            fontSize: wp('14.5', { showPixel: false }),

                            borderBottomWidth: 0,
                        },
                        headerStyle: {
                            borderBottomWidth: 0,
                        },
                    }
                )
            }
        }, [navigation, props])
    )
}
