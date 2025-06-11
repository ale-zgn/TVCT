import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'

import { hp, wp } from '../../Services/hooks/ResponsivePercentage'
import { useTranslation } from '../../Services/hooks/useTranslation'

type Props = {
    title: string
    action: () => void
    backgroundColor?: string
    textColor?: string
    style?: object
    bottom?: boolean
    textFontFamily?: string
    textFontSize?: number
    containerStyle?: any
    containerBackgroundColor?: string
    disabled?: boolean
    hasActivityIndicator?: boolean
    defaultMargin?: any
}
export default function MaintButton({
    title,
    action,
    backgroundColor = '#000',
    textColor = '#fff',
    textFontFamily = 'medium',
    textFontSize = wp('6%', { showPixel: false }),
    style,
    bottom = false,
    containerStyle = null,
    containerBackgroundColor = 'transparent',
    disabled = false,
    hasActivityIndicator = false,
    defaultMargin = null,
}: Props) {
    const { translate } = useTranslation()
    return (
        <View style={[bottom ? styles.container : containerStyle, { backgroundColor: containerBackgroundColor }]}>
            <Pressable
                style={[
                    styles.buttonContainer,
                    { backgroundColor: disabled ? '#D5D5D5' : backgroundColor, marginBottom: defaultMargin || hp('3%', { showPixel: false }), ...style },
                ]}
                onPress={action}
                disabled={disabled}>
                {hasActivityIndicator ? (
                    <ActivityIndicator size='large' color='white' />
                ) : (
                    <Text style={[styles.buttonText, { color: textColor, fontFamily: textFontFamily, fontSize: textFontSize }]}>{translate(`${title}`)}</Text>
                )}
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
        paddingVertical: hp('2.75%', { showPixel: false }),
        position: 'absolute',
        bottom: 0,
        width: wp('100%', { showPixel: false }),
        backgroundColor: '#fff',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: hp('7.25%', { showPixel: false }),
        width: wp('90%', { showPixel: false }),
        alignSelf: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: wp('6%', { showPixel: false }),
        fontFamily: 'medium',
    },
})
