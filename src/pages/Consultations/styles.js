import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F5',
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    paddingTop: 20,
    marginBottom: 20,
    
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#385b3e',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#385b3e',
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#385b3e',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  familyText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  doctorText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  addButton:{
backgroundColor: "#385b3e",
width: 70,
height: 30,
borderRadius: 10,
display: "flex",
flexDirection: "row",
justifyContent: "center",
alignItems: "center"
  },

  dateText: {
    fontSize: 13,
    color: '#385b3e',
  },
});