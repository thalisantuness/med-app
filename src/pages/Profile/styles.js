import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },

  buttonHeader: {
    color: "#ffffff",
    backgroundColor: "#DD3E7B",
    borderRadius: 10,
    width: 80,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textButtonHeader: {
    color: "#ffffff",
  },
  homeContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",

    width: "100%",
    height: "auto",
    paddingTop: 40,
    paddingBottom: 40,
  },

  titleWelcome: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitleWelcome: {
    fontSize: 20,
    marginBottom: 10,
  },

  listProfissionals: {
    height: "auto",

    width: "100%",
  },

  cardProfissional: {
    height: 140,
    backgroundColor: "#FF27A2",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    paddingLeft: 10,
    marginTop: 10,
    borderRadius: 10,
  },

  titleInfoProfissional: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  subtitleInfoProfissional: {
    color: "#FFFFFF",
  },

  rowInfoProfissional: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    justifyContent: "space-evenly",
  },

  columnInfoProfissional: {
    display: "flex",
    flexDirection: "column",
  },

  avatarProfissional: {
    borderRadius: "100%",
    height: 70,
    width: 70,
  },

  userInfo: {
    marginBottom: 33,
    marginHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImageContainer: {
    justifyContent: "flex-end",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  service: {
    flexDirection: "row",
  },
  bubble: {
    marginBottom: 32,
    flexDirection: "colunm",
    backgroundColor: "#FF27A2",
    borderRadius: 30,
    padding: 20,
    justifyContent: "flex-start",
    marginLeft: 28,
  },
  appointmentContainer: {
    marginLeft: 28,
  },
  bubble1: {
    flexDirection: "column",
    backgroundColor: "#FAFAFA",
    borderRadius: 30,
    padding: 20,
    alignItems: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },

  barberImageContainer: {
    marginRight: 10,
  },
  barberImage1: {
    width: 48,
    height: 48,
  },
  realizedText: {
    marginTop: 40,
    color: "#DD3E7B",
    alignItems: "baseline",
  },
  barberName: {
    color: "#00000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  barberName1: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  bubbleContent: {
    flex: 1,
    justifyContent: "flex-start",
  },
  serviceType: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#000000",
    justifyContent: "flex-start",
  },
  serviceType1: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#FFFFFF",
    justifyContent: "flex-start",
  },
  lineImage: {
    width: "auto",
    height: 2,
    paddingHorizontal: 20,
    paddingHorizontal: 16,
    backgroundolor: "Black",
  },
  date: {
    fontSize: 16,
    marginTop: 5,
    color: "#000000",
  },
  date1: {
    fontSize: 16,
    marginTop: 5,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  previousAppointments: {
    marginLeft: 10,
  },
  appointmentContent: {
    marginBottom: 40,
  },
  appointment: {
    flexDirection: "row",
    fontSize: 16,
    marginBottom: 90,
  },
  home: {
    alignItems: "center",
  },
  homeText: {
    fontSize: 16,
    color: "#007AFF",
  },
  barberImage: {
    width: 48,
    height: 48,
    borderRadius: 30,
    marginRight: 10,
  },
});
