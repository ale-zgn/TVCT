import React from 'react'
import { DimensionValue, Pressable, StyleSheet, Text, View } from 'react-native'
import { wp } from '../../Services/hooks/ResponsivePercentage'

interface HomeDetailsProps {
    icon: any
    name: string
    value: string | number | boolean | null | undefined
    selectedSort?: boolean
    swidth?: DimensionValue | undefined
}

export const HomeDetails = ({ icon, name, value, selectedSort, swidth = '50%' }: HomeDetailsProps) => {
    let handleValueDisplay = (value: any) => {
        if (value instanceof Array) {
            return <Text style={styles.valueText}>{value[0]}</Text>
        } else {
            return <Text style={styles.valueText}>{value || '/'}</Text>
        }
    }

    return (
        <View
            style={[
                styles.HomeDetailContainer,
                { marginRight: selectedSort ? wp('4%', { showPixel: false }) : wp('2%', { showPixel: false }), width: swidth },
            ]}>
            {selectedSort && (
                <View style={styles.HomeDetailsIcon}>
                    <Pressable style={[styles.pressable, { width: 40, height: 40 }]}>{icon}</Pressable>
                </View>
            )}

            <View>
                <Text style={{ color: '#666666', textAlign: 'left', fontSize: wp('4%', { showPixel: false }), fontFamily: 'regular' }}>{name}</Text>
                {handleValueDisplay(value)}
            </View>
        </View>
    )
}

export const HomeDetails2 = ({ icon, name, value, selectedSort, swidth }: HomeDetailsProps) => {
    let handleValueDisplay = (value: string | string[] | number) => {
        if (value instanceof Array) {
            return <Text style={styles.valueText2}>{value[0]}</Text>
        } else {
            return <Text style={styles.valueText2}>{value}</Text>
        }
    }

    return (
        <View
            style={[
                styles.HomeDetailContainer2,
                { marginRight: selectedSort ? wp('4%', { showPixel: false }) : wp('2%', { showPixel: false }), width: swidth },
            ]}>
            {selectedSort && (
                <View>
                    <Pressable style={[styles.pressable, { width: 40, height: 40 }, { marginBottom: wp('2%', { showPixel: false }) }]}>{icon}</Pressable>
                </View>
            )}

            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#666666', textAlign: 'center', fontSize: wp('4%', { showPixel: false }), fontFamily: 'regular' }}>{name}</Text>
                {handleValueDisplay(value)}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    HomeDetailsIcon: {
        marginRight: wp('2%', { showPixel: false }),
    },
    HomeDetailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    HomeDetailContainer2: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    pressable: {
        borderRadius: 100,
        backgroundColor: '#F9F6F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    valueText: {
        color: '#121212',
        textAlign: 'left',
        fontSize: wp('3%', { showPixel: false }),
        // fontFamily: "medium"
    },
    valueText2: {
        color: '#121212',
        textAlign: 'left',
        fontSize: wp('3%', { showPixel: false }),
        // fontFamily: "medium"
    },
})
