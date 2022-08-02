import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { button, inputGroup, modal } from '../../assets/styles/Styles';
import { Divider } from 'react-native-paper';
import { onRunExternalRQST } from '../../services/communications';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';

export const SignupScreen = ({ navigation, route }) => {

    const [isloading, setisloading] = React.useState(false);
    const [isFocus, setIsFocus] = React.useState(false);
    const [isFocusg, setIsFocusg] = React.useState(false);
    const [hosp ,sethosp] = React.useState({});
    const [gender, setgender] = React.useState("");
    const [genders, setgeders] = React.useState([]);
    const [hosps, sethops] = React.useState([]);
    const [temp, settemp] = React.useState([]);
    const [isVisible, setisVisible] = React.useState(false);
    let [uri, seturi] = React.useState("none");

    const loadHospitals = async () => {
        await onRunExternalRQST({
            method: "GET",
            url: "/hospitals/list"
        }, (err, done) => {
            if(done && done['status'] === 200){
                sethops(done['data'])
                settemp(done['data'])
            }else{
                Toast.show({
                    type: 'error',
                    text1: <Text style={{fontFamily: "mons-b"}}>Erreur</Text>,
                    text2: <Text style={{fontFamily: "mons"}}>Erreur de chargement des informations ...</Text>,
                });
            }
        })
    };

    const onImageLibraryPress = async () => {
        (async () => {
            if (Platform.OS !== 'web') {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                return;
              }
            }
        })();

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
        if(result.cancelled) {

          return;
        }
    
        let localUri = result.uri;
        let filename = localUri.split('/').pop();
      
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        setisVisible(false)
        seturi({ uri: localUri, name: filename, type });
    }
    
    const onCameraPress = async () => {
        (async () => {
            if (Platform.OS !== 'web') {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                return;
              }
            }
        })();

        let res = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            storageOptions: {
                skipBackup: false,
                path: 'images',
            }
        });
        if(res.cancelled){
          return;
        } 
    
        let localUri = res.uri;
        let filename = localUri.split('/').pop();
      
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        setisVisible(false)
        seturi({ uri: localUri, name: filename, type });
    }

    const onSubmit = async () => {
        if(1){
            await onRunExternalRQST({
                method: "GET",
                url: "/hospitals/list"
            }, (err, done) => {
                if(done && done['status'] === 200){
                    sethops(done['data'])
                    settemp(done['data'])
                }else{

                }
            })
        }else{
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Completer tous les champs avant de continuer !',
            });
        }
    };

    React.useEffect(() => {
    }, [])

    return(
        <>
            <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
                <Header colors={Colors.whiteColor} />
                    <ScrollView 
                        contentContainerStyle={{ paddingBottom: "auto", backgroundColor: Colors.primaryColor }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor,  marginTop: Dims.smallradius, paddingBottom: 100 }}>
                        <View style={{width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 0}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Nom <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <TextInput placeholder='Nom' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <FontAwesome name="user" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                </View>
                            </View>
                            {/* ------------------------ */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Postnom <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <TextInput placeholder='Postnom' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <FontAwesome name="user" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse mail <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <TextInput placeholder='Adresse mail ...' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <MaterialIcons name="email" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Numéro de téléphone <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <TextInput placeholder='Numéro de téléphone' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <Entypo name="phone" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                <TouchableHighlight 
                                    underlayColor={ Colors.whiteColor }
                                    onPress={() => setisVisible(true)}
                                    style={{ width: "100%", flexDirection: "row", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                    <>
                                        <MaterialIcons name="add-photo-alternate" size={Dims.iconsize} color={ Colors.whiteColor } />
                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons", paddingHorizontal: 10 }}>Photo de profile</Text>
                                        { uri !== "none" && typeof uri === "object" ? <AntDesign name="checkcircle" size={Dims.iconsize} color={ Colors.whiteColor } /> : <></> }
                                    </>
                                </TouchableHighlight>
                            </View>
                            <Divider style={{ marginTop: 25 }} />
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Mot de passe <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <TextInput placeholder='Crée un mot de passe ici ' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <Entypo name="lock" size={ Dims.iconsize} color={Colors.whiteColor } />
                                    </View>
                                </View>
                            </View>
                            {/* ------------------------ */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Confirmation mot de passe <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <TextInput placeholder='confirme le mot de passe ici ' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <Entypo name="lock" size={ Dims.iconsize} color={Colors.whiteColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                <TouchableHighlight 
                                    underlayColor={ Colors.whiteColor }
                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Enregistrer</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", width: "85%", alignSelf: "center", alignContent: "center", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ width: "45%" }}>
                                <Divider/>
                            </View>
                            <View>
                                <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>OU</Text>
                            </View>
                            <View style={{ width: "45%" }}>
                                <Divider/>
                            </View>
                        </View>
                        <View style={{ width: "85%", alignSelf: "center" }}>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                <TouchableHighlight 
                                    underlayColor={Colors.whiteColor}
                                    onPress={() => {
                                        navigation.navigate("signin")
                                    }}
                                    style={{ width: "100%", backgroundColor: Colors.secondaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Connexion</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <Modal
                isVisible={isVisible}
                onBackButtonPress={() => { setisVisible(false) }}
                onBackdropPress={() => { setisVisible(false) }}
                style={[modal, { position: "absolute", bottom: 0, width: "100%", backgroundColor: Colors.whiteColor, borderTopRightRadius: Dims.borderradius, borderTopStartRadius: Dims.borderradius }]}>
                <SafeAreaView style={[button, { paddingVertical: 15 }]}>
                    <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between", alignSelf: "center" }}>
                        <TouchableHighlight 
                            underlayColor={Colors.primaryColor} 
                            style={[button, { paddingVertical: 10, borderRadius: Dims.borderradius, backgroundColor: Colors.pillColor, width: "25%" }]} onPress={onImageLibraryPress}
                        >
                            <>
                                <Ionicons name="images" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>Galleries</Text>
                            </>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={Colors.primaryColor} 
                            style={[button, { paddingVertical: 10, borderRadius: Dims.borderradius, backgroundColor: Colors.pillColor, width: "25%" }]} onPress={onCameraPress}
                        >
                            <>
                                <Ionicons name="camera" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>Camera</Text>
                            </>
                        </TouchableHighlight>
                    </View>
                </SafeAreaView>
            </Modal>
                    </View>
                    <Footer/>
                </ScrollView>
            </View>
        </>
    )
}