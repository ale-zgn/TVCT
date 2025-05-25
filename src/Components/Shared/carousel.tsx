import { useRoute } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { View, ScrollView, ImageBackground, Text, StyleSheet, TouchableOpacity, ImageResizeMode } from "react-native"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import CachedImageBackground from 'expo-cached-image-background'
import { stringMd5 } from "react-native-quick-md5"

type CarouselProps = {
    images: any[]
    imageWidth?: string
    onItemPress?: (item: any, index: number) => void
    resizeValue?: ImageResizeMode
    currentImgIndex?: number
}

export default function Carousel({ images, imageWidth = "100%", onItemPress, resizeValue, currentImgIndex }: CarouselProps) {
    const [currentImg, setCurrentImg] = useState(currentImgIndex)

    const scrollViewRef = useRef(null)
    useEffect(() => {
        if (currentImg) {
            const offset = wp(imageWidth) * currentImg
            setTimeout(() => {
                //@ts-ignore
                scrollViewRef.current?.scrollTo({ x: offset, animated: false })
            }, 10)
        }
    }, [currentImg, imageWidth])

    return (
        <View style={styles.container}>
            <ScrollView
                style={[styles.scrollView, { height: images.length > 0 ? hp("35%") : undefined }]}
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
                    <TouchableOpacity key={image.uri} style={[styles.imageContainer, { width: wp(imageWidth) }]} onPress={() => onItemPress && onItemPress(image, i)}>
                        <CachedImageBackground
                            isBackground={true}
                        // <ImageBackground
                            cacheKey={stringMd5(image.uri)}
                            imageStyle={styles.image}
                            source={{ uri: image.uri }}
                            style={[styles.imageBackground, { width: wp(imageWidth) }]}
                            resizeMode={resizeValue || "cover"}
                        >
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
        width: "100%",
    },
    scrollView: {
        width: "100%",
    },
    imageContainer: {
        width: wp("100%"),
        height: hp("35%"),
        backgroundColor: "rgba(0,0,0,0.75)",
    },
    imageBackground: {
        width: wp("100%"),
        height: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    image: {
        opacity: 0.8,
    },
    photoNumberContainer: {
        backgroundColor: "rgba(49, 45, 45, 0.50)",
        padding: wp("1%"),
        position: "absolute",
        bottom: hp("2%"),
        left: wp("4.5%"),
        paddingRight: wp("1,75%"),
    },
    photoNumber: {
        color: "white",
        fontSize: hp("1.5%"),
        // letterSpacing: wp("0.75%"),
        left: wp("1%"),
        marginRight: wp("1.5%"),
    },
})
