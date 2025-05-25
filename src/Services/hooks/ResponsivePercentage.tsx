import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'

// Always return an integer
export const wp = (percentage: string | number): number => {
    return Math.round(widthPercentageToDP(percentage))
}

export const hp = (percentage: string | number): number => {
    return Math.round(heightPercentageToDP(percentage))
}
