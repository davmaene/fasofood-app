import * as React from 'react';
import { View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { returnInitialOfNames } from '../../assets/const/helper.helper';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { Feather, Ionicons, AntDesign, FontAwesome, FontAwesome5, Entypo } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';
import { map } from '../../assets/styles/Styles';
import DialogBox from 'react-native-dialogbox';
import { appname } from '../../assets/configs/configs';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { onDeconnextion, onGetLocation } from '../../services/communications';
import * as Updates from 'expo-updates';
import { Loader } from '../../components/Loader/comp.loader';

export const ProfileScreen = ({ navigation }) => {
    const user = global && global['user'];
    const [isVisible, setisVisible] = React.useState(false);
    const [isloading, setisloading] = React.useState(false);
    const ref = React.useRef();
    const refmap = React.useRef();
    const [isloggedin, setisloggedin] = React.useState(false);
    const [coords, setcoords] = React.useState({
        latitude: parseFloat(-1.6734344),
        longitude: parseFloat(29.2325225)
    });

    const onConfirm = async () => {

    };

    const onSetCurrentPosition = () => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                ref.current.confirm({
                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Paramètres</Text>,
                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >{appname} N'arrive pas à avoir accès à votre position; </Text>],
                    ok: {
                        text: 'Authoriser',
                        style: {
                            color: Colors.primaryColor,
                            fontFamily: 'mons'
                        },
                        callback: () => onSetCurrentPosition()
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
                setisloading(true);
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
                            console.log(" My pos => ", coords);
                            onGetLocation((err, done) => {
                                if(done){
                                    setisloading(false);
                                    console.log(" Date is => ", done);
                                }else{
                                    setisloading(false);
                                }
                            })
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

    const handDeconnexion = async () => {

        onDeconnextion((er, done) => {
            if(done){
                refmap.current.tip({
                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Paramètres</Text>,
                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Vos informations sont bien supprimées de cet appareil </Text>],
                    btn: {
                        text: 'D\'accord',
                        style: {
                            color: Colors.primaryColor,
                            fontFamily: 'mons'
                        },
                        callback: () => Updates.reloadAsync()
                    }
                })
            }else{
                refmap.current.confirm({
                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Paramètres</Text>,
                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Une erreur vient de se produire lors de la déconnexion </Text>],
                    ok: {
                        text: 'Reessayer',
                        style: {
                            color: Colors.primaryColor,
                            fontFamily: 'mons'
                        },
                        callback: () => onde()
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
        })
    }

    React.useEffect(() => {
        if(global.user) setisloggedin(true);
        else setisloggedin(false);
    }, [])

    return(
        <>
            <Title navigation={undefined} title={"Profile"} subtitle={"Personalisation du profile"} Colors />
            {/* if user is logged in */}
            <View style={{ backgroundColor: Colors.whiteColor, flex: 1, display: isloggedin ? "flex" : "none" }}>
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
                <ScrollView 
                    style={{ padding: 20 }}
                    contentContainerStyle={{ paddingBottom: "50%" }}
                >
                    <View style={{ backgroundColor: Colors.pillColor }}>
                        {/* <TouchableHighlight
                            style={{ flexDirection: "row", height: 40, width: "100%", padding: 6, alignContent: "center", alignItems: "center", marginBottom: 5 }}
                        >
                            <>
                                <View style={{ width: 30, height: 30, borderRadius: 4, backgroundColor: Colors.dangerColor, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                                    <Feather name='power' size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b" }}>Déconnexion</Text>
                            </>
                        </TouchableHighlight>
                        <Divider/> */}
                        {/* <TouchableHighlight
                            style={{ flexDirection: "row", height: 40, width: "100%", padding: 6, alignContent: "center", alignItems: "center", marginBottom: 5 }}
                        >
                            <>
                                <View style={{ width: 30, height: 30, borderRadius: 4, backgroundColor: Colors.dangerColor, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                                    <F name='mar' size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b" }}>Déconnexion</Text>
                            </>
                        </TouchableHighlight>
                        <Divider/> */}
                        <TouchableHighlight
                            style={{ flexDirection: "row", height: 40, width: "100%", padding: 6, alignContent: "center", alignItems: "center", marginBottom: 5 }}
                        >
                            <>
                                <View style={{ width: 30, height: 30, borderRadius: 4, backgroundColor: Colors.primaryColor, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                                    <Feather name='edit' size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b" }}>Modifier les informations de mon compte</Text>
                            </>
                        </TouchableHighlight>
                        <Divider/>
                        <TouchableHighlight
                            style={{ flexDirection: "row", height: 40, width: "100%", padding: 6, alignContent: "center", alignItems: "center", marginBottom: 5 }}
                            onPress={() => {
                                refmap.current.confirm({
                                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Paramètres</Text>,
                                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >{appname} Vous êtes sur le point de vous déconnecter de cet appareil, voulez-vous vraiement continuer</Text>],
                                    ok: {
                                        text: 'Continuer',
                                        style: {
                                            color: Colors.primaryColor,
                                            fontFamily: 'mons'
                                        },
                                        callback: () => {
                                            setisloading(true);
                                            handDeconnexion();
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
                            }}
                            underlayColor={Colors.pillColor}
                        >
                            <>
                                <View style={{ width: 30, height: 30, borderRadius: 4, backgroundColor: Colors.dangerColor, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                                    <Feather name='power' size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b" }}>Déconnexion</Text>
                            </>
                        </TouchableHighlight>

                    </View>
                </ScrollView>
            </View>
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, display: isloggedin ? "none" : "flex"  }}>
                <View style={{ paddingHorizontal: 20, alignSelf: "center", marginTop: 20, width: "100%" }}>
                    <View style={{ alignSelf: "center", flexDirection: "column", width: "100%" }}>
                        <View style={{ alignSelf: "center" }}>
                            <AntDesign name="user" size={Dims.iconsize * 5.5} color="black" />
                        </View>
                        <View style={{ marginTop: 20, marginBottom: 30 }}>
                            <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Connectez-vous avec votre numéro de téléphone ou votre adresse mail. Bénéficiew de toutes les fonctionnalité de <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{appname}</Text> </Text>
                        </View>
                    </View>
                    <Divider />
                </View>

                <View style={{  }} >
                    <View style={{ width: "85%", alignSelf: "center" }}>
                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                            <TouchableHighlight 
                                onPress={() => navigation.navigate("signin")}
                                style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Connexion à mon compte</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{ width: "85%", alignSelf: "center" }}>
                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 2 }}>
                            <TouchableHighlight 
                                onPress={() => navigation.navigate("signup")}
                                style={{ width: "100%", backgroundColor: Colors.secondaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Créer un compte</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{ width: "85%", alignSelf: "center" }}>
                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 2 }}>
                            <TouchableHighlight 
                                underlayColor={Colors.secondaryColor}
                                onPress={() => navigation.navigate("recoverpassword")}
                                style={{ width: "100%", backgroundColor: Colors.pillColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons-b" }}>Mot de passe oublié ?</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
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
                                {
                                    isloading
                                    ?
                                        <Loader/>
                                    :
                                    <>
                                        <AntDesign name="checkcircleo" size={ Dims.iconsize } color={Colors.whiteColor} />
                                        <Text style={{ paddingLeft: 10, fontFamily: "mons", color: Colors.whiteColor }}>Prendre ma position actuelle</Text>
                                    </>
                                }
                            </TouchableHighlight>
                        </View>
                    </View>
                    <DialogBox ref={ref} isOverlayClickClose={false} />
                </Modal>
            </View>
            {/* else user is not loggedin */}
            <Footer/>
            <DialogBox ref={refmap} isOverlayClickClose={false} />
        </>
    )
}