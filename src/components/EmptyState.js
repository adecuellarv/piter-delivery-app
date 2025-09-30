import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export function EmptyState({
  icon = "notifications-outline",
  title = "No hay elementos",
  description = "No se encontraron elementos para mostrar",
  action,
  className = "",
  ...props
}) {
  return (
    <View className={`flex-1 items-center justify-center p-8 ${className}`} {...props}>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-4">
          <Ionicons name={icon} size={32} color="#9AA0A6" />
        </View>

        <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">{title}</Text>

        <Text className="text-base text-gray-600 dark:text-gray-400 text-center max-w-xs">{description}</Text>
      </View>

      {action && action}
    </View>
  )
}
