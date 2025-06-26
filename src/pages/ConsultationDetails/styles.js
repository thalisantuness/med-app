import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#385b3e",
  },
  detailCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: "48%",
  },
  actionButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  rescheduleButton: {
    backgroundColor: "#FF9800",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  deleteButton: {
    backgroundColor: "#9E9E9E",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#385b3e",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelModalButton: {
    backgroundColor: "#9E9E9E",
  },
  confirmModalButton: {
    backgroundColor: "#385b3e",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  pickerContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  marginBottom: 15,
  color: '#000000',
  overflow: 'hidden',
},
switchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 15,
  paddingVertical: 10,
},
});