import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useNavigation, useRoute } from '@react-navigation/native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import HomeUnloggedPage from '../../Screens/HomeUnlogged/HomeUnloggedPage'
import { useTabStyle } from '../../Services/hooks/NavigationTabStyle'
import { useTranslation } from '../../Services/hooks/useTranslation'
const HomeStackUnlogged = createNativeStackNavigator()

export default function HomeStackUnloggedScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const tabHiddenRoutes = ['ProjectScreen']
    const { translate } = useTranslation()

    useTabStyle({
        tabBarStyle: {
            display: 'flex',
            backgroundColor: '#121212',
            borderTopWidth: 0,
            height: hp('10%'),
        },
    })

    // useLayoutEffect(() => {
    //     const routeName = getFocusedRouteNameFromRoute(route);

    //     if (routeName === "ProjectScreen") {
    //         navigation.setOptions({
    //             tabBarStyle: {
    //                 display: "none",
    //             },
    //         });
    //     } else {
    //         navigation.setOptions({
    //             tabBarStyle: {
    //                 display: "flex",
    //             },
    //         });
    //     }
    // }, [route]);

    return (
        <HomeStackUnlogged.Navigator>
            <HomeStackUnlogged.Screen
                name='HomeScreen'
                component={HomeUnloggedPage}
                options={{
                    headerShown: false,
                }}
            />
        </HomeStackUnlogged.Navigator>
    )
}
