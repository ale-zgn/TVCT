module.exports = ({ config }) => {
    return {
        expo: {
            name: 'TVCT',
            slug: 'TVCT',
            version: '1.0.0',
            orientation: 'portrait',
            owner: 'wissal',
            icon: './assets/splash-icon.png',
            scheme: 'carvisit',
            privacy: 'unlisted',
            userInterfaceStyle: 'automatic',
            jsEngine: 'hermes',
            newArchEnabled: true,
            android: {
                adaptiveIcon: {
                    foregroundImage: './assets/splash-icon.png',
                    backgroundColor: '#ffffff',
                },
                edgeToEdgeEnabled: true,

                package: 'com.alee.carvisit',
            },
            ios: {
                buildNumber: '1',
                supportsTablet: false,
                bundleIdentifier: 'carvisit',
            },
            web: {
                bundler: 'metro',
                favicon: './assets/images/favicon.png',
            },
            plugins: [
                [
                    'expo-splash-screen',
                    {
                        image: './assets/splash-icon.png',
                        imageWidth: 200,
                        resizeMode: 'contain',
                        backgroundColor: '#ffffff',
                    },
                ],
            ],
            extra: {
                eas: {
                    projectId: '724b4f2f-72ec-46b2-a4e0-8801b42689a0',
                },
            },
        },
    }
}
