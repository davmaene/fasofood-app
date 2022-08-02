import * as React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Divider } from 'react-native-paper';
import { Colors } from '../../assets/colors/Colors';
import { appname } from '../../assets/configs/configs';

export const Header = ({ colors }) => {
    return(
        <>
            <StatusBar backgroundColor={ Colors.primaryColor } barStyle={ colors ? "light-content" : "default" } />
            <View style={{ padding: 10, alignContent: "center", alignSelf: "center", marginTop: 12, height: 150, justifyContent: "center" }}>
                <Text style={{ fontFamily: "nab", textAlign: "center", fontSize: 35, color: colors ? colors : Colors.primaryColor }}>{appname}</Text>
                <Text style={{ textAlign: "center", fontFamily: "mons-e", color: colors ? colors : Colors.primaryColor }} >Avec <Text style={{fontFamily: "mons"}}>{appname}</Text>, ne mourrez plus de faim </Text>
                <Divider style={{ marginVertical: 10, backgroundColor: Colors.whiteColor }} />
                <Text style={{ textAlign: "center", fontFamily: "mons-e", color: colors ? colors : Colors.primaryColor }} >{appname} vous permet de passer une commande dans les milliers des fastfood de notre collection, et d'être livrer en un temps record </Text>
            </View>
        </>
    )
}