import * as React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { returnInitialOfNames } from '../../assets/const/helper.helper';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { Feather, Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';
import { map } from '../../assets/styles/Styles';

export const ProfileScreen = ({ navigation }) => {
    const user = global && global['user'];
    const [isVisible, setisVisible] = React.useState(false);
    const [coords, setcoords] = React.useState({
        latitude: parseFloat(-1.6734344),
        longitude: parseFloat(29.2325225)
    });
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
            <View style={{ backgroundColor: "lime", padding: 20, alignSelf: "center" }}>
                <Modal
                    style={{ position: "absolute", bottom: -20, height: 500, overflow: "hidden", backgroundColor: Colors.whiteColor, alignSelf: "center" }}
                    isVisible={isVisible}
                    onBackButtonPress={() => { setisVisible(false) }}
                    onBackdropPress={() => { setisVisible(false) }}
                    onDismiss={() => setisVisible(false)}
                >
                    <View style={[ map, { alignSelf: "center", overflow: "hidden" } ]}>
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
                                description={`${user.fsname.toUpperCase()}  ${user.lsname.toUpperCase()} | Votre position actuelle ...`}
                            />
                        </MapView>
                    </View>
                </Modal>
            </View>
            <Footer/>
        </>
    )
}