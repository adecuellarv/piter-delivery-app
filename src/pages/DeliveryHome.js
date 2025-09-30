import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Card, Button, Badge } from "../components"

const MOCK_ASSIGNMENTS = [
  {
    id: "1",
    orderId: "12345",
    customerName: "Juan Pérez",
    address: "Av. Siempre Viva 742, Springfield",
    estimatedTime: "15 min",
    status: "in_progress",
  },
  {
    id: "2",
    orderId: "12346",
    customerName: "María García",
    address: "Calle Falsa 123, Ciudad",
    estimatedTime: "25 min",
    status: "assigned",
  },
  {
    id: "3",
    orderId: "12344",
    customerName: "Carlos López",
    address: "Av. Principal 456, Centro",
    estimatedTime: "Completado",
    status: "completed",
  },
]

export function DeliveryHome() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "assigned":
        return <Badge variant="primary">Asignado</Badge>
      case "in_progress":
        return <Badge variant="warning">En Progreso</Badge>
      case "completed":
        return <Badge variant="success">Completado</Badge>
      default:
        return <Badge variant="default">Desconocido</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "assigned":
        return "time-outline"
      case "in_progress":
        return "car-outline"
      case "completed":
        return "checkmark-circle-outline"
      default:
        return "help-circle-outline"
    }
  }

  return (
    <ScrollView className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      {/* Status Summary */}
      <Card className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estado Actual</Text>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-sm text-gray-600 dark:text-gray-400">Entregas Asignadas</Text>
          <Text className="text-lg font-semibold text-blue-600">3</Text>
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-sm text-gray-600 dark:text-gray-400">En Progreso</Text>
          <Text className="text-lg font-semibold text-orange-600">1</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600 dark:text-gray-400">Completadas Hoy</Text>
          <Text className="text-lg font-semibold text-green-600">1</Text>
        </View>
      </Card>

      {/* Assignments */}
      <Card className="mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Mis Asignaciones</Text>
          <Badge variant="primary">3</Badge>
        </View>

        <View className="space-y-3">
          {MOCK_ASSIGNMENTS.map((assignment) => (
            <TouchableOpacity
              key={assignment.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg active:bg-gray-100 dark:active:bg-gray-600"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-semibold text-gray-900 dark:text-white">Pedido #{assignment.orderId}</Text>
                {getStatusBadge(assignment.status)}
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="person-outline" size={16} color="#9AA0A6" />
                <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">{assignment.customerName}</Text>
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={16} color="#9AA0A6" />
                <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2 flex-1">{assignment.address}</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name={getStatusIcon(assignment.status)} size={16} color="#9AA0A6" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">ETA: {assignment.estimatedTime}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9AA0A6" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Notifications Summary */}
      <Card className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notificaciones</Text>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-sm text-gray-600 dark:text-gray-400">No leídas</Text>
          <Text className="text-lg font-semibold text-blue-600">5</Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-sm text-gray-600 dark:text-gray-400">Total hoy</Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">12</Text>
        </View>

        <Button variant="outline">Ver Todas las Notificaciones</Button>
      </Card>

      {/* Quick Actions */}
      <Card className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</Text>

        <View className="space-y-3">
          <Button variant="primary">Iniciar Ruta</Button>
          <Button variant="outline">Ver Mapa</Button>
        </View>
      </Card>
    </ScrollView>
  )
}
