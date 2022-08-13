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
import PhoneInput from "react-native-phone-number-input";
import { Loader } from '../../components/Loader/comp.loader';

export const SignupScreen = ({ navigation, route }) => {

    const [isloading, setisloading] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [formattedValue, setFormattedValue] = React.useState("");
    const [isVisible, setisVisible] = React.useState(false);
    let [uri, seturi] = React.useState("none");
    const phoneInput = React.useRef();
    const [output, setoutput] = React.useState("");

    const [fs, setfs] = React.useState("");
    const [ls, setls] = React.useState("");
    const [email, setemail] = React.useState("");
    const [pwd, setpwd] = React.useState("");
    const [pwdr, setpwdr] = React.useState("");

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
    };
    
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
    };

    const onSubmit = async () => {
        setoutput("");
        try {
            if(fs.length > 0){
                if(ls.length > 0){
                    if(email.length > 0){
                        if(value.length > 5 && formattedValue.length > 0){
                            if(pwd.length >= 6){
                                if(pwd === pwdr){
                                    setisloading(true);
                                    const formdata = new FormData();
                                    formdata.append("username", `${fs} ${ls}`);
                                    formdata.append("phone", formattedValue);
                                    formdata.append("email", email);
                                    formdata.append("password", pwd);
                                    formdata.append("avatar", uri);
                        
                                    onRunExternalRQST({
                                        method: "POST",
                                        data: formdata,
                                        url: `/auth/create`
                                    }, (err, done) => {
                                        if(done){
                                            setisloading(false);
                                            switch (done && done['status']) {
                                                case 201:
                                                    navigation.replace("verifyaccount", { item: { user:  done && done['data'], code: "---" } });
                                                    break;
                                                case 500:
                                                    setoutput("Le numéro de téléphone ou l'adresse mail est déjà pris !");
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur',
                                                        text2: 'Une erreur inconnue vient de se produire !',
                                                    });
                                                    break;
                                                default:
                                                    setoutput("Une erreur inconnue vient de se produire !")
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur',
                                                        text2: 'Une erreur inconnue vient de se produire !',
                                                    });
                                                    break;
                                            }
                                        }else{
                                            setoutput("Une erreur inconnue vient de se produire !")
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Erreur',
                                                text2: 'Une erreur inconnue vient de se produire !',
                                            });
                                        }
                                    })
                                }else{
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Les mot de passe ne sont pas identiques !',
                                    });
                                    setoutput("Les mot de passe ne sont pas identiques !")

                                }
                            }else{
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur',
                                    text2: 'Le mot de passe doit avoir 6 catactères au minimum !',
                                }); 
                                setoutput("Le mot de passe doit avoir 6 catactères au minimum !")
                            }
                        }else{
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur',
                                text2: 'Entrer le numéro de téléphone !',
                            });
                            setoutput("Entrer le numéro de téléphone !")
                        }
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur',
                            text2: 'Ajouter l\'adresse mail !',
                        });
                        setoutput("Ajouter l\'adresse mail !")
                    }
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Ajouter le postnom d\'utilisateur svplait !',
                    });
                    setoutput("Ajouter le postnom d\'utilisateur svplait !")
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Ajouter le nom d\'utilisateur svplait !',
                });
                setoutput("Ajouter le nom d\'utilisateur svplait !")
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Une erreur inconnue vient de se produire !',
            });
            setoutput("Une erreur inconnue vient de se produire !")
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
                                        <TextInput onChangeText={txt => setfs(txt)} placeholder='Nom' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
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
                                        <TextInput onChangeText={txt => setls(txt)} placeholder='Postnom' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
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
                                        <TextInput onChangeText={txt => setemail(txt)} placeholder='Adresse mail ...' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <MaterialIcons name="email" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 2}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Numéro de téléphone <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={[ inputGroup.inputcontainer, {  }]}>
                                        <PhoneInput
                                            textContainerStyle={{ fontFamily: "mons" }}
                                            containerStyle={{ width: "100%", flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}
                                            ref={phoneInput}
                                            defaultValue={value}
                                            defaultCode="DM"
                                            layout="first"
                                            onChangeText={(text) => {
                                                // alert(text)
                                                setValue(text);
                                            }}
                                            onChangeFormattedText={(text) => {
                                                setFormattedValue(text);
                                            }}
                                            textInputStyle={{ fontFamily: "mons",  fontSize: Dims.iputtextsize }}
                                            placeholder={"Entrer le numéro"}
                                            codeTextStyle={{ fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            // withDarkTheme
                                            // withShadow
                                            // autoFocus 
                                        />
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
                                        <TextInput onChangeText={txt => setpwd(txt)} placeholder='Crée un mot de passe ici ' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
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
                                        <TextInput onChangeText={txt => setpwdr(txt)} placeholder='confirme le mot de passe ici ' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <Entypo name="lock" size={ Dims.iconsize} color={Colors.whiteColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                <TouchableHighlight 
                                    onPress={() => onSubmit()}
                                    underlayColor={ Colors.whiteColor }
                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                   { isloading ? <Loader /> : <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Enregistrer</Text> }
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