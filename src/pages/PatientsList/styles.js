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
});
