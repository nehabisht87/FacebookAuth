import { Button, StyleSheet, Text, View, Image } from 'react-native'
import React, {useState} from 'react'
import { LoginButton, AccessToken, AuthenticationToken, LoginManager, GraphRequestManager, GraphRequest, Settings } from 'react-native-fbsdk-next';


const App = () => {
  const [fbUserInfo, setFbUserInfo] = useState({});
    // Settings.setAppID('551907212786996');


  const facebookLogin = resCallback => {
    LoginManager.logOut(); // if user already login then logout

    return LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        // console.log('FB result ==>>', result);
        if (
          result.declinedPermissions &&
          result.declinedPermissions.includes('email')
        ) {
          resCallback({ message: 'Email is required' });
        }
        if (result.isCancelled) {
          // Login cancelled
        } else {
          const infoRequest = new GraphRequest(
            '/me?fields=email,name,picture',
            null,
            resCallback,
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        console.log('FBLogin fail with error =>', error);
      },
    );
  };
  
  const onfbPress = async () => {
    try {
      await facebookLogin(responseInfoCallBack);
    } catch (error) {
      console.log(error);
    }
  }
  
  const responseInfoCallBack = async (error, result) => {
    if (error) {
      console.log('Error', error);
      return;
    } else {
      const userData = result;
      if (userData && Object.keys(userData).length) {
        setFbUserInfo(userData);
        console.log('FACEBOOK DATA', userData);
        // navigation.navigate('HomePage');
      }
    }
  };
  // console.log(fbUserInfo.email, "abc")
  return (
    <View style={styles.container}>
      <Button title="Login" onPress={() => onfbPress()} />
      <Text style={styles.myInfo}>Name {fbUserInfo?.name}</Text>
      <Text style={styles.myInfo}>Email {fbUserInfo?.email}</Text>
      <Image style={styles.img} source={{uri: fbUserInfo.picture.data.url}} />
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',    
  },
  myInfo: {
    marginHorizontal: 100,
    marginVertical: 15,
  },
  img: {
    marginHorizontal: 100,
    marginTop: 15,
    height: 100,
    width: 100,
  }
})