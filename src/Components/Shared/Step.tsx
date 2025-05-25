import { StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { 
    heightPercentageToDP as hp, 
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

interface Props {
    index: number,
    selectedStep: number,
    handleStepPress: (step: number) => void,
    selectedColor: string,
    unselectedColor: string,
}

export default function Step({ index, selectedStep, handleStepPress, selectedColor, unselectedColor  } : Props) {
  return (
    <Pressable
        key={index}
        style={[
            styles.step,
            {
            backgroundColor: selectedStep === index ? selectedColor : unselectedColor,
            width: selectedStep === index ? 15 : 7.5,
            },
        ]}
        onPress={() => handleStepPress(index)}
    />
  )
}

const styles = StyleSheet.create({
    step: {
        height: 7.5,
        borderRadius: 5,
        marginHorizontal: 2.5,
    }
})