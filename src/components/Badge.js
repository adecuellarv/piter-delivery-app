import { View, Text } from "react-native"

export function Badge({ children, variant = "default", size = "md", className = "", ...props }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary"
      case "success":
        return "bg-success"
      case "warning":
        return "bg-warning"
      case "danger":
        return "bg-danger"
      case "high":
        return "bg-danger"
      case "normal":
        return "bg-gray-500"
      case "unread":
        return "bg-primary"
      case "read":
        return "bg-gray-400"
      default:
        return "bg-gray-500"
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 min-h-[20px]"
      case "md":
        return "px-2.5 py-1.5 min-h-[24px]"
      case "lg":
        return "px-3 py-2 min-h-[28px]"
      default:
        return "px-2.5 py-1.5 min-h-[24px]"
    }
  }

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs"
      case "md":
        return "text-sm"
      case "lg":
        return "text-base"
      default:
        return "text-sm"
    }
  }

  return (
    <View
      className={`
        rounded-full flex-row items-center justify-center
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      {...props}
    >
      <Text className={`${getTextSize()} font-medium text-white`}>{children}</Text>
    </View>
  )
}
