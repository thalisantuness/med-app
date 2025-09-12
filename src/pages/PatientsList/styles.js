import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFB",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#385b3e",
    fontWeight: "500",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#385b3e",
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  item: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userIcon: {
    marginRight: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#385b3e",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },

  // Adicione estas propriedades ao seu objeto de estilos
  socialSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#385b3e",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    margin: 5,
    minWidth: 120,
    justifyContent: "center",
  },
  instagramButton: {
    backgroundColor: "#E1306C",
  },
  facebookButton: {
    backgroundColor: "#3b5998",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  socialButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
});
