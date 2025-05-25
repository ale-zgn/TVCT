import { View, Text, StyleSheet, Image, TextInput } from 'react-native'
import React from 'react'
import { ConfirmedIcon, PhotoIcon } from '../../../assets/svgs/Svg';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { Controller } from 'react-hook-form';
import { useTranslation } from '../../Services/hooks/useTranslation';

interface PersonalInformationItemProps {
    title: string;
    confirmed?: boolean;
    control: any;
    name: string;
    rules: any;
    errors: {
        [key: string]: any;
    };
    placeholder: string;
    secureTextEntry?: boolean;
}

export default function PersonalInformationItem({ title, confirmed, control, name, rules, errors, placeholder, secureTextEntry }: PersonalInformationItemProps) {
    const{language} = useTranslation();
   // console.log(errors[name])
    return (
     
        <View style={styles.itemContainer}>
            <View>
                <Text style={styles.inputTitle}>{title}</Text>
                <Controller
                    control={control}
                    rules={rules}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder={placeholder}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholderTextColor={'#666666'}
                            textAlign={language == "ar" ? "right" : "left" }
                            style={styles.value}
                            secureTextEntry={secureTextEntry}
                    />
                    )}
                    name={name}
                    defaultValue=""
                />
            </View>
            {
                confirmed &&  <View style={styles.confirmedContainer}>
                    <Text style={styles.confirmedTitle}>Confirmed</Text>
                    <ConfirmedIcon />
                </View>
            }
             {errors[name] && <Text
        style={styles.error}
    >{errors[name].message}</Text>}
    </View>
   
   
  )
}


const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: wp('7.5%'),
        paddingVertical: hp('2.5%'),
        borderColor: '#F1F1F1',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    }, 
    inputTitle: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
        color: '#666666',
        alignSelf: 'flex-start'
    }, 
    value: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
        color: '#000',
        marginTop: hp('0.25%'),
    },
    confirmedTitle: {
        fontSize: wp('3.75%'),
        fontFamily: 'medium',
        color: '#85553A',
        marginRight: wp('2%'),
    },
    confirmedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    error: {
        color: '#FF0000',
        fontSize: wp('4.5%'),
        fontFamily: 'regular',
        marginTop: hp('1%'),
        textAlign: 'left',
    }
})