import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, ScrollView, Dimensions, TextInput, Alert, AsyncStorage } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { btn } from '../../assets/styles/Styles';
import { AntDesign, Entypo, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export const Fasoscreen = ({ navigation }) => {
    return (
        <>
            <View style={{flex: 1, justifyContent: "center"}}>
                <View style={{width: "90%", alignSelf: "center"}}>
                    <Text style={{ textAlign: "center", paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize }}>Aucun restaurant</Text>
                    <Text style={{ textAlign: "center", alignSelf: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Nous venons de détécter que votre compte n'est lié à aucun restaurant pour l'instant.</Text>
                    <View style={{ marginTop: 20 }}>
                        <TouchableHighlight
                            underlayColor={ Colors.primaryColor }
                            onPress={() => {}}
                            style={[btn]}
                        >
                            <>
                                <Ionicons name='add-circle-outline' color={ Colors.whiteColor } />
                                <Text style={{ fontFamily: "mons", paddingHorizontal: 10, color: Colors.whiteColor }}>Ajouter un restaurant</Text>
                            </>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </>
    )
}