import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'

export const wp = (percentage: string | number, showPixel?: { showPixel: boolean } | undefined): any => {
    let value = Math.round(widthPercentageToDP(percentage))
    return showPixel != undefined ? value : value + 'px'
}

export const hp = (percentage: string | number, showPixel?: { showPixel: boolean } | undefined): any => {
    let value = Math.round(heightPercentageToDP(percentage))
    return showPixel != undefined ? value : value + 'px'
}
