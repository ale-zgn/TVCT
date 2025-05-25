import { AlertNotificationRoot, Root } from 'react-native-alert-notification'
import { Provider } from 'react-redux'
import Router from './src/Router/Router'
import { TranslationProvider } from './src/Services/hooks/useTranslation'

import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { AppProvider } from './src/Services/hooks/AppProvider'
import { store } from './src/Store/store'

import { useEffect } from 'react'

import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency'
import React from 'react'

function App() {
    useEffect(() => {
        ;(async () => {
            const { status } = await requestTrackingPermissionsAsync()
            if (status === 'granted') {
                console.log('Yay! I have user permission to track data')
            }
        })()
    }, [])

    return (
        <ActionSheetProvider>
            <Root>
                <AlertNotificationRoot>
                    <Provider store={store}>
                        <TranslationProvider>
                            <AppProvider>
                                <Router />
                            </AppProvider>
                        </TranslationProvider>
                    </Provider>
                </AlertNotificationRoot>
            </Root>
        </ActionSheetProvider>
    )
}

export default App

// export default Sentry.Native.wrap(App);
