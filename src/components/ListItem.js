import { TouchableOpacity, View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"

export function ListItem({
  title,
  subtitle,
  leftIcon,
  rightIcon = "chevron-forward",
  badge,
  onPress,
  className = "",
  ...props
}) {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onPress()
    }
  }

  return (
    <TouchableOpacity
      className={`
        flex-row items-center p-md bg-white dark:bg-gray-800
        border-b border-gray-100 dark:border-gray-700
        active:bg-gray-50 dark:active:bg-gray-700
        ${className}
      `}
      onPress={handlePress}
      activeOpacity={0.8}
      {...props}
    >
      {leftIcon && (
        <View className="mr-3">
          <Ionicons name={leftIcon} size={24} color="#5F6368" />
        </View>
      )}

      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900 dark:text-white">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</Text>}
      </View>

      {badge && <View className="mr-3">{badge}</View>}

      {rightIcon && <Ionicons name={rightIcon} size={20} color="#9AA0A6" />}
    </TouchableOpacity>
  )
}
