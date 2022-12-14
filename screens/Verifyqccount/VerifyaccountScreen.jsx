import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Keyboard, RefreshControl } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { cel, inputGroup } from '../../assets/styles/Styles';
import { Divider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { onRunExternalRQST, onRunInsertQRY, onRunRetrieveQRY } from '../../services/communications';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell
} from 'react-native-confirmation-code-field';
import { Loader } from '../../components/Loader/comp.loader';

const CELL_COUNT = 6;
export const VerifyaccountScreen = ({ navigation, route }) => {

    const item = route && route['params'] && route['params']['item'];
    const user = item && item['user'];
    const code = item && item['code'];

    const [isloading, setisloading] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [canverify, setcanverify] = React.useState(true); 
    const [c, setc] = React.useState(code)
    const [u, setu] = React.useState(user)
    let [tries, settries] = React.useState(0);
    const [onresed, setonresed] = React.useState(false);

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

    const onVerify = () => {
        setisloading(true)
        if(1){
            onRunExternalRQST({
                url: '/auth/verify-email',
                method: "POST",
                data: {
                    "otp": `${value}`,
                    "userId": `${user && user['_id']}`
                }
            }, (er, dn) => {
                console.log(" The response is ", dn);
                if(dn && dn['status'] === 200){
                    const u = user;
                    const __ = u && u['username'];
                    const fs = __.substring(0, __.lastIndexOf(" "));
                    const ls = __.substring(__.lastIndexOf(" ") + 1);

                    onRunInsertQRY({
                        table: "__tbl_users",
                        columns: `'fsname', 'lsname', 'phone', 'email', 'crearedon', 'role'`,
                        dot: "?, ?, ?, ?, ?, ?",
                        values: [`${fs}`, `${ls}`, `${u['phone']}`, `${u['email']}`, `${new Date().toLocaleString()}`, `${u['role']}`]
                    }, (err, insert) => {
                        if(insert){
                            global.user = u;
                            navigation.replace("tabs");
                        }else{
                            setisloading(false);
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur',
                                text2: 'Une erreur est survenue lors de l\'activation du compte !',
                            });
                        }
                    })
                }else{
                    setisloading(false);
                    setcanverify(true);
                    setValue("")
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Une erreur est survenue lors de l\'activation du compte !',
                    });
                }
            })

        }else{
            setisloading(false)
            setValue("")
            settries(++tries);
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Le code entrer est incorrect !',
            });
        }
    };

    const onValueFulFil = () => {
        if(value.length === CELL_COUNT){
            setcanverify(true);
            setisloading(true);
            onVerify();
        }
    };

    const onSubmit = async () => {
        setisloading(true);
        setcanverify(false);
        const id = u && u['_id'] ? u['_id'].toString().trim() : "";
        await onRunExternalRQST({
            method: "POST",
            url: `/auth/resend-verify-email/${id}`,
            data: {}
        }, (err, done) => {
            // console.log(" Response is => ", done);
            if(done){
                setcanverify(true);
                setisloading(false);
                switch (done['status']) {
                    case 201:
                        // setc(done && done['data']['code']);
                        global.user = u;
                        setonresed(true);
                        Toast.show({
                            type: 'success',
                            text1: 'Code envoy??',
                            text2: 'Le code vient d\'??tre envoy?? ?? votre adresse email !',
                        });
                        break;
                    case 500:
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur',
                            text2: 'Une erreur inconue vient de se produire !',
                        });
                        break;
                    default:
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur',
                            text2: 'Une erreur inconue vient de se produire !',
                        });
                        break;
                }
            }else{
                setcanverify(true);
                setisloading(false);
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Une erreur inconue vient de se produire !',
                });
            }
        })
    };

    React.useEffect(() => {
        onValueFulFil()
    }, [onValueFulFil])

    return(
        <>
            <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
                <Header colors={Colors.whiteColor} />
                    <ScrollView 
                        contentContainerStyle={{ paddingBottom: 0, backgroundColor: Colors.primaryColor }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}

                        refreshControl={
                            <RefreshControl
                                refreshing={isloading}
                                colors={[ Colors.primaryColor, Colors.secondaryColor ]}
                            />
                        }
                    >
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, height: Dims.height, marginTop: Dims.smallradius }}>
                        <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                            <Text style={{fontFamily: "mons-e", textAlign: "center"}}>
                                Nous venons de detecter que votre compte n'est pas encore activ??; un code de v??rification a ??t?? envoyer au num??ro de t??l??phone&nbsp;
                                <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{u && u['phone']}</Text> et ?? l'adresse 
                                <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor, paddingHorizontal: 3 }}>&nbsp;{u && u['email']}</Text>
                            </Text>
                            {onresed ?
                            (
                                <>
                                    <Divider style={{ marginVertical: 10 }} />
                                    <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Tachez de v??rifier votre boite mail, <Text style={{ fontFamily: "mons-b" }} > v??rifiez aussi la liste de vos spams</Text> </Text>
                                </>
                            )
                            :
                            (
                                <></>
                            )
                            }
                        </View>
                        <View style={{ width: "85%", alignSelf: "center", marginTop: 5 }}>
                            <View style={{width: "100%", height: 75, flexDirection: "column"}}>
                                <View style={[ inputGroup.iconcontainer, { backgroundColor: "transparent", alignSelf: "center" }]}>
                                    <Entypo name="lock" size={Dims.iconsize * 2} color={ Colors.primaryColor } />
                                </View>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 0, color: Colors.primaryColor, alignSelf: "center" }}>Code de v??rification</Text>
                            </View>
                            <View style={{ marginVertical: 10, height: 45, marginTop: 25, flexDirection: "row", justifyContent: "space-around" }}>
                            <CodeField
                                ref={ref}
                                {...props}
                                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                rootStyle={{marginTop: 20}}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({index, symbol, isFocused}) => (
                                <Text
                                    key={index}
                                    style={[cel,{ fontFamily: "mons", justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", paddingTop: 5 }, isFocused && {borderColor: '#000'}]}
                                    onLayout={getCellOnLayoutHandler(index)}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                                )}
                            />
                            </View>
                            {/* ------------------------ */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 10 }}>
                                <TouchableHighlight 
                                    onPress={() => {
                                        onVerify()
                                    }}
                                    disabled={canverify}
                                    underlayColor={ Colors.whiteColor }
                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                    {isloading 
                                    ?
                                    <Loader/>
                                    :
                                    <Text style={{ color: !canverify ? Colors.whiteColor : Colors.pillColor, fontFamily: "mons" }}>V??rifier</Text>    
                                    }
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", width: "85%", alignSelf: "center", alignContent: "center", alignItems: "center", justifyContent: "space-between" }}>
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
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 10 }}>
                                <TouchableHighlight 
                                    onPress={() => onSubmit()}
                                    style={{ width: "100%", backgroundColor: Colors.secondaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Renvoyer le code de v??rification ?</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{ width: "85%", alignSelf: "center", display: tries >= 3 ? "flex" : "none" }}>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 0 }}>
                                <TouchableHighlight 
                                    onPress={() => navigation.navigate("signup")}
                                    style={{ width: "100%", backgroundColor: Colors.secondaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Cr??er un compte</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{ width: "85%", alignSelf: "center" }}>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 2 }}>
                                <TouchableHighlight 
                                    onPress={() => navigation.navigate("signin")}
                                    style={{ width: "100%", backgroundColor: Colors.pillColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons-b" }}>Connexion avec un autre compte ?</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Footer/>
            </View>
        </>
    )
}