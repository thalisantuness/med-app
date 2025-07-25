import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    // fontFamily: 'Alata-Regular',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  signupContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    // fontFamily: 'Alata-Regular',
    fontSize: 16,

  },
  signupLinkText: {
    // fontFamily: 'Alata-Regular',
    color: '#E63E8F',
    textDecorationLine: 'underline',
   
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderColor: 'gray',
    paddingHorizontal: 'auto',
    marginTop: 10,
  },
  passwordIconContainer: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  passwordIcon: {
    marginLeft: 10,
  },
  inputLabel: {
    // fontFamily: 'Alata-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
    color: '#A7A6A5',
    width: '100%',
  },
  loginButtonContainer: {
    marginTop: 270,
    alignItems: 'center',
  },
  loginButton: {
    marginTop: 40,
    width: '60%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#385b3e',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBackground: {
    backgroundColor: '#EFF2F1',
    borderWidth: 0,
    borderRadius: 8,
  },
  loginButtonText: {
    // fontFamily: 'Alata-Regular',
    fontWeight: 'bold',
    color: 'white',
  },

   centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },},
    buttonCloseModalLogin:{
      marginTop: 20,
      
      backgroundColor: '#385b3e',
      width: 90,
      height: 30,
    borderRadius: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  
    },
    buttonTextCloseModalLogin:{
      fontWeight: 'bold',
      color: 'white',
    },
});
  
