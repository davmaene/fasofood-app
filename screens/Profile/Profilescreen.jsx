import * as React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { returnInitialOfNames } from '../../assets/const/helper.helper';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';

export const ProfileScreen = ({ navigation }) => {
    const user = global && global['user'];
    return(
        <>
            <Title navigation={undefined} title={"Profile"} subtitle={"Personalisation du profile"} />
            <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
                <View style={{ width: "100%", padding: 12 }}>
                    <View style={{ alignSelf: "center" }} >
                        <Avatar
                            title={returnInitialOfNames({ fsname: user && user['fsname'], lsname: user && user['lsname'] })}
                            rounded
                            titleStyle={{ fontFamily: "mons-b", textTransform: "uppercase", fontSize: Dims.bigtitletextsize }}
                            size={"large"}
                            containerStyle={{ backgroundColor: Colors.primaryColor }}
                        />
                    </View>
                    <View>
                        
                    </View>
                </View>
                {/* ------------------------------ */}
                <View>

                </View>
            </View>
            <Footer/>
        </>
    )
}