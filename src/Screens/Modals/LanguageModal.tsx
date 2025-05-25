import { useNavigation } from '@react-navigation/native'
import { CheckIcon } from 'assets/svgs/Svg'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import MaintButton from '../../Components/Shared/MaintButton'
import { useGetPropertiesQuery, useUpdateUserLanguageMutation } from '../../Services/API'
import { useAppProvider } from '../../Services/hooks/AppProvider'
import { useTranslation } from '../../Services/hooks/useTranslation'

export default function LanguageModal() {
    const navigation = useNavigation()
    const { translate, language: selectedLanguage, switchLanguage } = useTranslation()
    const [languageUpdate, languageUpdateMutation] = useUpdateUserLanguageMutation()

    const [selected, setSelected] = React.useState(selectedLanguage)
    const { refetch } = useGetPropertiesQuery(selectedLanguage)
    const { clearFilters } = useAppProvider()

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.blackContainer}
                onPress={() => {
                    navigation.goBack()
                }}
            />
            <View>
                <Pressable style={[styles.itemContainer, { borderTopWidth: 0, borderBottomWidth: 1, marginTop: hp('2%') }]} onPress={() => setSelected('en')}>
                    <Text style={styles.inputTitle}>{translate('English')}</Text>
                    {selected === 'en' ? <CheckIcon /> : null}
                </Pressable>
                <Pressable style={styles.itemContainer} onPress={() => setSelected('ar')}>
                    <Text style={styles.inputTitle}>{translate('Arabic')}</Text>
                    {selected === 'ar' ? <CheckIcon /> : null}
                </Pressable>
                <MaintButton
                    title={translate('Save modifications')}
                    action={async () => {
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: `${translate('Success')}`,
                            textBody: `${translate('Your modifications have been saved')}`,
                            titleStyle: { textAlign: selectedLanguage == 'ar' ? 'right' : 'left' },
                            textBodyStyle: { textAlign: selectedLanguage == 'ar' ? 'right' : 'left' },
                        })
                        switchLanguage(selected)
                        await languageUpdate({ language_id: selected === 'en' ? 1 : 2 })
                        clearFilters()
                        refetch()
                        navigation.goBack()
                    }}
                    backgroundColor='black'
                    textColor='white'
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    blackContainer: {
        backgroundColor: '#000000a6',
        height: 'auto',
        flex: 1,
    },
    mainContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        justifyContent: 'center',
        paddingBottom: 25,
        position: 'absolute',
        bottom: -10,
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    inputTitle: {
        fontSize: wp('5%'),
        fontFamily: 'medium',
        color: '#666666',
    },
    itemContainer: {
        width: wp('90%'),
        alignSelf: 'center',
        backgroundColor: '#fff',
        paddingVertical: hp('3%'),
        borderColor: '#F1F1F1',
        borderTopWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: wp('100%'),
        backgroundColor: 'white',
        paddingVertical: hp('1.75%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    backText: {
        fontFamily: 'medium',
        color: '#666666',
        fontSize: wp('5.25%'),
        alignSelf: 'flex-start',
        marginLeft: wp('5%'),
        marginTop: hp('3%'),
    },
})
