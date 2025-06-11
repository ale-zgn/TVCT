import CachedImageBackground from 'expo-cached-image-background'
import React, { useEffect, useRef, useState } from 'react'
import { ImageResizeMode, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { stringMd5 } from 'react-native-quick-md5'
import { hp, wp } from '../../Services/hooks/ResponsivePercentage'

type CarouselProps = {
    images: any[]
    imageWidth?: string
    onItemPress?: (item: any, index: number) => void
    resizeValue?: ImageResizeMode
    currentImgIndex?: number
}

export default function Carousel({ images, imageWidth = '100%', onItemPress, resizeValue, currentImgIndex }: CarouselProps) {
    const [currentImg, setCurrentImg] = useState(currentImgIndex)

    const scrollViewRef = useRef(null)
    useEffect(() => {
        if (currentImg) {
            const offset = wp(imageWidth, { showPixel: false }) * currentImg
            setTimeout(() => {
                //@ts-ignore
                scrollViewRef.current?.scrollTo({ x: offset, animated: false })
            }, 10)
        }
    }, [currentImg, imageWidth])

    return (
        <View style={styles.container}>
            <ScrollView
                style={[styles.scrollView, { height: images.length > 0 ? hp('35%', { showPixel: false }) : undefined }]}
                horizontal
                ref={scrollViewRef}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={10}
                pagingEnabled
                /* onScroll={(event) => {
                    const contentOffset = event.nativeEvent.contentOffset.x
                    const currentIndex = Math.floor(contentOffset / wp(imageWidth))
                    setCurrentImg(currentIndex)
                }} */
            >
                {images.map((image, i) => (
                    <TouchableOpacity
                        key={image.uri}
                        style={[styles.imageContainer, { width: wp(imageWidth, { showPixel: false }) }]}
                        onPress={() => onItemPress && onItemPress(image, i)}>
                        <CachedImageBackground
                            isBackground={true}
                            // <ImageBackground
                            cacheKey={stringMd5(image.uri)}
                            imageStyle={styles.image}
                            source={{ uri: image.uri }}
                            style={[styles.imageBackground, { width: wp(imageWidth, { showPixel: false }) }]}
                            resizeMode={resizeValue || 'cover'}>
                            <View style={styles.photoNumberContainer}>
                                <Text style={styles.photoNumber}>
                                    {i + 1} / {images.length}
                                </Text>
                            </View>
                        </CachedImageBackground>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    scrollView: {
        width: '100%',
    },
    imageContainer: {
        width: wp('100%', { showPixel: false }),
        height: hp('35%', { showPixel: false }),
        backgroundColor: 'rgba(0,0,0,0.75)',
    },
    imageBackground: {
        width: wp('100%', { showPixel: false }),
        height: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    image: {
        opacity: 0.8,
    },
    photoNumberContainer: {
        backgroundColor: 'rgba(49, 45, 45, 0.50)',
        padding: wp('1%', { showPixel: false }),
        position: 'absolute',
        bottom: hp('2%', { showPixel: false }),
        left: wp('4.5%', { showPixel: false }),
        paddingRight: wp('1,75%', { showPixel: false }),
    },
    photoNumber: {
        color: 'white',
        fontSize: hp('1.5%', { showPixel: false }),
        // letterSpacing: wp("0.75%"),
        left: wp('1%', { showPixel: false }),
        marginRight: wp('1.5%', { showPixel: false }),
    },
})
