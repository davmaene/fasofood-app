import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, ScrollView, Dimensions, TextInput, Alert, AsyncStorage } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'; 
import { inputGroup } from '../../assets/styles/Styles';
import { EmptyList } from '../../components/Emptylist/com.emptylist';

export const Searchscreen = ({ navigation }) => {
    const [search, setSearch] = React.useState('');

    const onChangeText = (text) => {
        // 
        setSearch(text);
    };

    return (
        <>
            <View style={{ paddingHorizontal: 10, backgroundColor: Colors.primaryColor, paddingVertical: 30 }}>
                <View style={[ inputGroup.container, { flexDirection: "row", borderColor: Colors.whiteColor}]}>
                    <View style={[ inputGroup.inputcontainer, { width: "75%" } ]}>
                        <TextInput placeholder={"Recherche ..."} onChangeText={(t) => onChangeText(t)} style={[ inputGroup.input, { fontFamily: "mons" } ]} />
                    </View>
                    <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor, width: "25%" }]}>
                        <AntDesign name="search1" size={ Dims.iconsize } color={ Colors.whiteColor } />
                    </View>
                </View>
            </View>
            <EmptyList/>
        </>
    )
}