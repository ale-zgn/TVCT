import React, { useRef, useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, ActivityIndicator, View } from "react-native"
import { ResizeMode, Video } from "expo-av"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"

interface VideoPlayerProps {
    source: any
    isVisible: boolean
    onVideoEnd: () => void
    isMuted: boolean
    resizeMode: ResizeMode
    showLoader: boolean
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source, isVisible, onVideoEnd, isMuted, resizeMode, showLoader }) => {
    const videoRef = useRef<Video>(null)
    const opacity = useSharedValue(1)
    const [isLoading, setIsLoading] = useState(true) // Track loading state

    const handleVideoDisappear = () => {
        opacity.value = 0
        onVideoEnd()
        setTimeout(() => {
            videoRef.current?.unloadAsync()
        }, 500)
    }

    const styleOpacity = useAnimatedStyle(() => ({
        opacity: withTiming(opacity.value, {
            duration: 500,
            easing: Easing.bezier(0.5, 0.01, 0, 1),
        }),
    }))

    useEffect(() => {
        if (isVisible) {
            videoRef.current?.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) {
                    setIsLoading(true) // Show loading indicator
                } else if (status.isPlaying) {
                    setIsLoading(false) // Hide loading indicator
                }
                //@ts-ignore
                if (status.didJustFinish || (status.positionMillis === status.durationMillis && status.isLoaded)) {
                    handleVideoDisappear()
                }

                if (status.isLoaded && !status.isPlaying && !status.didJustFinish) {
                    videoRef.current?.playAsync()
                }
            })
        }
    }, [isVisible])

    if (!isVisible) return null

    return (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleVideoDisappear}>
            <Animated.View style={[styleOpacity, styles.videoContainer]}>
                {isLoading && showLoader && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}
                <Video ref={videoRef} source={source} rate={1} volume={isMuted ? 0 : 1} isMuted={isMuted} resizeMode={resizeMode} shouldPlay style={styles.video} />
            </Animated.View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 9999,
        flex: 1,
    },
    videoContainer: { flex: 1, backgroundColor: "black" },
    video: { flex: 1, width: "100%", height: "100%" },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject, // Center the indicator
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Slight overlay
    },
})

export default VideoPlayer
