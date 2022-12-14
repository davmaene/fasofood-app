import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, Alert, AsyncStorage } from 'react-native';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import { Header } from '../../components/Header/comp.header';
import { Title } from '../../components/Title/Title';

export const CommandesScreen = ({ navigation }) => {
    return (
        <>
            <Title title={"Commandes "} subtitle={"Liste des vos commandes"} />
            <EmptyList/>
        </>
    )
}