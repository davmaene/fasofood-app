import * as React from 'react';
import { StatusBar, View, Text, Animated, TouchableHighlight, Modal, TextInput } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Loaderonsignalsent } from '../../components/Loaderonsignalsent/Loaderonsignlasent';
import FadeInOut from 'react-native-fade-in-out';
import { btn, inputGroup } from '../../assets/styles/Styles';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Title } from '../../components/Title/Title';
import { Footer } from '../../components/Footer/comp.footer';
import * as Location from 'expo-location';
import DialogBox from 'react-native-dialogbox';
import { appname, umergencyphonenumber } from '../../assets/configs/configs';
import { onRunExternalRQST } from '../../services/communications';
import Toast from 'react-native-toast-message';
import { Loader } from '../../components/Loader/comp.loader';
import * as Linking from "expo-linking";
import { toastConfig } from '../../assets/Toast/Toastconfig';
import { EmptyList } from '../../components/Emptylist/com.emptylist';

const bradius = 100;
const aradius = 130;
const r = aradius / 2;

export const HomeScreen = ({ navigation }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const [message, setmessage] = React.useState("Un signal d'alerte est émis dans les établissements sanitaires");
    const [isloading, setisloading] = React.useState(false);
    const [showmodal, setshowmodal] = React.useState(false);
    const [shw, setshw] = React.useState(false);
    const [messagecustomer, setmessagecustomer] = React.useState("");
    const ref = React.useRef();
    const [before, setbefore] = React.useState(false);
    const [sending, setsending] = React.useState(false);

    const onConfirm = () => {
        if(isloading){
            setmessage("Un signal d'alerte est emis dans les établissements sanitaires")
            setisloading(false)
            setshw(false);
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }).start();
        }else{
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
                    setbefore(true);         
                    let { coords } = await Location.getCurrentPositionAsync({});
                    const { speed, altitude, longitude, latitude } = coords;
                    await onRunExternalRQST({
                        url: "/users/user/sendsos",
                        data: {
                            latitude, 
                            longitude, 
                            hospitalref: global['user']['hospitalref'], 
                            phone: global['user']['phone'], 
                            fsname: global['user']['fsname'], 
                            lsname: global['user']['lsname'], 
                            altitude, 
                            speed
                        },
                        // !latitude || !longitude || !phone || !altitude || !speed
                        method: "POST"
                    }, (err, don) => {
                        // console.log(don);
                        if(don){
                            setbefore(false);
                            switch (don['status']) {
                                case 200:
                                    Toast.show({
                                        type: 'success',
                                        text1: 'Traitement en cours',
                                        text2: 'Votre requête est en cours de traitement !',
                                    });
                                    setisloading(!isloading);
                                    setTimeout(() => {
                                        Animated.timing(fadeAnim, {
                                            toValue: 1,
                                            duration: 1000,
                                            useNativeDriver: true
                                        }).start();
                                        setmessage("Ne vous déplacez pas; les sécours arrivent incessement !")
                                        setshw(true)
                                    }, 3200);
                                    break;
                                case 401:
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Quelques paramètres manques dans la requête envoyée ',
                                    });
                                    break;
                                default:
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Une erreur est survenue lors de l\'activation du compte !',
                                    });
                                    break;
                            }
                        }else{
                            setbefore(false);
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur',
                                text2: 'Une erreur est survenue lors de l\'activation du compte !',
                            });
                        }
                    })
                }
            })();
        }
    };

    const onsendingCustomMessage = async () => {
        if(messagecustomer.length >= 3){
            setsending(true);
            let { coords } = await Location.getCurrentPositionAsync({});
            const { speed, altitude, longitude, latitude } = coords;
            await onRunExternalRQST({
                url: "/users/user/sendsos",
                data: {
                    latitude, 
                    longitude, 
                    hospitalref: global['user']['hospitalref'], 
                    phone: global['user']['phone'], 
                    fsname: global['user']['fsname'], 
                    lsname: global['user']['lsname'], 
                    description: messagecustomer,
                    altitude, 
                    speed
                },
                // !latitude || !longitude || !phone || !altitude || !speed
                method: "POST"
            }, (err, don) => {
                // console.log(don);
                if(don){
                    setbefore(false);
                    setsending(false);
                    switch (don['status']) {
                        case 200:
                            Toast.show({
                                type: 'success',
                                text1: 'Traitement en cours',
                                text2: 'Votre requête est en cours de traitement !',
                            });
                            setmessagecustomer("")
                            setisloading(!isloading);
                            setTimeout(() => {
                                Animated.timing(fadeAnim, {
                                    toValue: 1,
                                    duration: 1000,
                                    useNativeDriver: true
                                }).start();
                                setmessage("Ne vous déplacez pas; les sécours arrivent incessement !")
                                setshw(true)
                            }, 3200);
                            break;
                        case 401:
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur',
                                text2: 'Quelques paramètres manques dans la requête envoyée ',
                            });
                            break;
                        default:
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur',
                                text2: 'Une erreur est survenue lors de l\'activation du compte !',
                            });
                            break;
                    }
                }else{
                    setsending(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Une erreur est survenue lors de l\'activation du compte !',
                    });
                }
            })
        }else{
            Toast.show({
                type: 'error',
                text1: 'Champ obligatoire',
                text2: 'Ajouter le message à envoyer s\'il vous plait !',
            });
        }
    };

    const props = {

    };

    return(
        <>
            <StatusBar barStyle={"light-content"} backgroundColor={ Colors.primaryColor } />
            <View>
                <EmptyList/>
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </>
    )
}