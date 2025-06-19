import React, {useState} from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";

const HoursList = ({ route, navigation }) => {
  const { month, day, dateString } = route.params;
  const [year, monthNum] = month.split('-');

  // Horários das 7h às 20h
  const [hours] = useState(Array.from({ length: 14 }, (_, i) => i + 7));

  // Tarefas fixas pré-definidas
  const fixedTasks = {
    12: "Almoço",
    14: "Academia",
    15: "Piscina",
    16: "Descanso",
    17: "Leitura",
    18: "Leitura",
    19: "Janta",
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>
        Horas do dia {day}/{monthNum}
      </Text>

      <View style={styles.content}>
        <FlatList
          data={hours}
          keyExtractor={(item) => String(item)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                fixedTasks[item] && styles.fixedTaskItem,
              ]}
              onPress={() =>
                navigation.navigate("TaskForm", {
                  month,
                  day: parseInt(day), // Garante que é número
                  hour: item,
                  fixedTask: fixedTasks[item],
                  dateString, // Passa a data completa
                })
              }
            >
              <Text style={styles.title}>
                {item}:00 {fixedTasks[item] && `- ${fixedTasks[item]}`}
              </Text>
              {fixedTasks[item] && (
                <Feather name="lock" size={16} color="#385b3e" />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default HoursList;