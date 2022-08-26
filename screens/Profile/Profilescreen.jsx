import * as React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { returnInitialOfNames } from '../../assets/const/helper.helper';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';
import { map } from '../../assets/styles/Styles';
import DialogBox from 'react-native-dialogbox';
import { appname } from '../../assets/configs/configs';
import * as Location from 'expo-location';

export const ProfileScreen = ({ navigation }) => {
    const user = global && global['user'];
    const [isVisible, setisVisible] = React.useState(false);
    const [isloading, setisloading] = React.useState(false);
    const ref = React.useRef();
    const refmap = React.useRef();
    const [coords, setcoords] = React.useState({
        latitude: parseFloat(-1.6734344),
        longitude: parseFloat(29.2325225)
    });

    const onSetCurrentPosition = () => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                ref.current.confirm({
                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Paramètres</Text>,
                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >{appname} N'arrive pas à avoir accès à votre position; vous ne pouvez pas envoyer une alerte sans cette fonctionnalité activée</Text>],
                    ok: {
                        text: 'Authoriser',
                        style: {
                            color: Colors.primaryColor,
                            fontFamily: 'mons'
                        },
                        callback: () => onConfirm()
                    },
                    cancel: {
                        text: 'Annuler',
                        style: {
                            color: Colors.darkColor,
                            fontFamily: "mons-e"
                        }
                    },
                })
              return;
            }else{
                ref.current.confirm({
                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Ajout de ma position</Text>,
                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >
                                Vous êtes sur le point de mettre à jour votre position actuelle
                            </Text>],
                    ok: {
                        text: 'Ajouter ma position actuelle',
                        style: {
                            color: Colors.primaryColor,
                            fontFamily: 'mons'
                        },
                        callback: async () => {    
                            let { coords } = await Location.getCurrentPositionAsync({});
                            const { speed, altitude, longitude, latitude } = coords;
                            setcoords(coords);
                        }
                    },
                    cancel: {
                        text: 'Annuler',
                        style: {
                            color: Colors.darkColor,
                            fontFamily: "mons-e"
                        }
                    },
                })
            }
        })()
    };

    return(
        <>
            <Title navigation={undefined} title={"Profile"} subtitle={"Personalisation du profile"} Colors />
            <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
                <View style={{ width: "100%", padding: 25 }}>
                    <View style={{ alignSelf: "center" }} >
                        <Avatar
                            title={returnInitialOfNames({ fsname: user && user['fsname'], lsname: user && user['lsname'] })}
                            rounded
                            titleStyle={{ fontFamily: "mons-b", textTransform: "uppercase", fontSize: Dims.bigtitletextsize }}
                            size={"large"}
                            containerStyle={{ backgroundColor: Colors.primaryColor }}
                        />
                    </View>
                    <View style={{ width: "100%", paddingTop: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "capitalize", alignSelf: "center", fontSize: Dims.bigtitletextsize }}>{user && user['fsname']} {user && user['lsname']}</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", alignSelf: "center" }}>{user && user['email']}</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", alignSelf: "center" }}>{user && user['phone']}</Text>
                        <Divider style={{ marginVertical: 4 }} />
                        <View style={{ alignSelf: "center", paddingTop: 10 }}>
                            <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Emplacement actuelle</Text>
                            <TouchableHighlight 
                                style={{ paddingVertical: 10 }}
                                underlayColor={Colors.whiteColor}
                                onPress={() => setisVisible(!isVisible)}
                            >
                                <Feather name="map-pin" size={Dims.iconsize} color={Colors.darkColor} style={{ alignSelf: "center" }} />
                            </TouchableHighlight>
                            <Text style={{ fontFamily: "mons-b", textAlign: "center" }}>---</Text>
                        </View>
                    </View>
                </View>
                {/* ------------------------------ */}
                <View>

                </View>
            </View>
            <View style={{ padding: 20, alignSelf: "center", overflow: "hidden", borderTopStartRadius: Dims.borderradius, borderTopEndRadius: Dims.borderradius }}>
                <Modal
                    style={{ position: "absolute", bottom: -20, height: 500, overflow: "hidden", backgroundColor: Colors.whiteColor, alignSelf: "center", borderTopStartRadius: Dims.borderradius - 6, borderTopEndRadius: Dims.borderradius - 6 }}
                    isVisible={isVisible}
                    onBackButtonPress={() => { setisVisible(false) }}
                    onBackdropPress={() => { setisVisible(false) }}
                    onDismiss={() => setisVisible(false)}
                >
                    <View style={[ map, { alignSelf: "center" } ]}>
                        <View style={{ position: "absolute", width: "100%", height: 75, backgroundColor: Colors.pillColor, zIndex: 2992782, top: 0, elevation: 28 }}>
                            <View style={{ flexDirection: "column", alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center", height: 75 }}>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.bigtitletextsize - 5 }}>Position actuelle</Text>
                                <Text style={{ fontFamily: "mons-e" }}>Customizer votre position actuelle</Text>
                            </View>
                        </View>
                        <MapView 
                            // ref={refmap}
                            region={
                                {
                                    latitudeDelta: 0.02,
                                    longitudeDelta: 0.02,
                                    ...coords
                                }
                            }
                            style={{ width: Dims.width, height: Dims.height }} 
                        >
                            <Marker
                                key={`128918234`}
                                // style={{ width: 20, height: 20 }}
                                icon={() => <Ionicons name='home' />}
                                // image={{uri: 'https://avatars.githubusercontent.com/u/50874479?s=400&u=27be3de52fb72efbaaf3656895d5c23be0a07ba7&v=4'}}
                                coordinate={coords}
                                title={"Vous êtes ici"}
                                description={`Votre position actuelle ...`}
                            />
                        </MapView>
                        <View style={{ position: "absolute", width: "100%", height: "auto", zIndex: 2992782, bottom: 0 }}>
                            <TouchableHighlight 
                                style={{ flexDirection: "row", elevation: 28, width: "90%", backgroundColor: Colors.primaryColor, alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center", height: 50, marginVertical: 15 }}
                                underlayColor={Colors.primaryColor}
                                onPress={onSetCurrentPosition}
                            >
                                <>
                                    <AntDesign name="checkcircleo" size={ Dims.iconsize } color={Colors.whiteColor} />
                                    <Text style={{ paddingLeft: 10, fontFamily: "mons", color: Colors.whiteColor }}>Prendre ma position actuelle</Text>
                                </>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <DialogBox ref={ref} isOverlayClickClose={false} />
                </Modal>
            </View>
            <Footer/>
            <DialogBox ref={refmap} isOverlayClickClose={false} />
        </>
    )
}