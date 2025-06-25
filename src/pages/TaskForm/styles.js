import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#385b3e',
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#385b3e',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#385b3e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  disabledInput: {
    backgroundColor: '#F5F7F9',
    color: '#6E7F8D',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#385b3e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#385b3e',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#385b3e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Mantendo seus outros estilos existentes
  item: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  width: '80%',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
  color: '#385b3e',
},
modalText: {
  fontSize: 16,
  marginBottom: 20,
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
modalButton: {
  padding: 10,
  borderRadius: 5,
  minWidth: '48%',
  alignItems: 'center',
},
cancelButton: {
  backgroundColor: '#e0e0e0',
},
confirmButton: {
  backgroundColor: '#385b3e',
},
modalButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
  // ... outros estilos que você já tinha
});