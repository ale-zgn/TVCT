import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { ArrowLeftIcon } from '../../../assets/svgs/Svg'
import { useNavigation } from '@react-navigation/native';

export default function DefaultHeaderLeft({color}: {color?: string}) {
    const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.goBack()} style={{padding: 10}}>
      <ArrowLeftIcon color={color} />
    </Pressable>
  )
}