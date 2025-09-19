import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFB",
        paddingHorizontal: 20,
    },
    header: {
        paddingTop: 40,
        backgroundColor: "#F8FAFB",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#385b3e",
        fontWeight: "500",
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#385b3e',
        textAlign: 'center',
        marginVertical: 20,
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
    },
    pickerContainer: {
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    button: {
        backgroundColor: '#385b3e',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#385b3e',
        marginBottom: 10,
    },
    userItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee'
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    userRole: {
        fontSize: 12,
        color: '#777',
    },
    userCpf: {
        fontSize: 14,
        color: '#555',
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    }
});