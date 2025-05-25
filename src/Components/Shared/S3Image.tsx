import { Image, ImageStyle, StyleProp, ViewStyle } from "react-native"
import React from "react"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import Config from "../../Config"


interface Props {
    file: string | undefined
    folder: "users/images" | "tickets/documents"
    customStyle?: StyleProp<ImageStyle>
}
export const S3Image = ({ file, folder, customStyle }: Props) => {

    let source = null
    if (file != null && file != "") {
        source = { uri: `${Config.EXPO_PUBLIC_S3_BUCKET}/${folder}/${file}` }
    } else if (folder == "users/images") {
        source = require("../../../assets/images/large_icon.png")
    } else if (source == null) {
        return null
    }

    return <Image source={source} style={[customStyle]} />
}
