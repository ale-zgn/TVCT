module.exports = ({ config }) => {
    return {
        expo: {
            name: 'car-visit',
            slug: 'car-visit',
            version: '1.0.0',
            orientation: 'portrait',
            icon: './assets/icon.png',
            scheme: 'carvisit',
            userInterfaceStyle: 'automatic',
            jsEngine: 'hermes',
            newArchEnabled: true,
            ios: {
                supportsTablet: true,
            },
            android: {
                adaptiveIcon: {
                    foregroundImage: './assets/adaptive-icon.png',
                    backgroundColor: '#ffffff',
                },
                edgeToEdgeEnabled: true,
            },
            web: {
                bundler: 'metro',
                favicon: './assets/images/favicon.png',
            },
            plugins: [
                [
                    'expo-splash-screen',
                    {
                        image: './assets/splash.png',
                        imageWidth: 200,
                        resizeMode: 'contain',
                        backgroundColor: '#ffffff',
                    },
                ],
            ],
        },
    }
}
