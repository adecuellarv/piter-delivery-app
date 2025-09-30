import { TouchableOpacity, Text, ActivityIndicator } from "react-native"
//import * as Haptics from "expo-haptics"

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onPress,
  className = "",
  ...props
}) {
  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onPress()
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary active:bg-blue-700"
      case "secondary":
        return "bg-gray-200 dark:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600"
      case "danger":
        return "bg-danger active:bg-red-700"
      case "outline":
        return "border-2 border-primary bg-transparent active:bg-primary/10"
      default:
        return "bg-primary active:bg-blue-700"
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 min-h-[36px]"
      case "md":
        return "px-4 py-3 min-h-[44px]"
      case "lg":
        return "px-6 py-4 min-h-[52px]"
      default:
        return "px-4 py-3 min-h-[44px]"
    }
  }

  const getTextStyles = () => {
    const baseStyles = "font-semibold text-center"
    const sizeStyles = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"

    switch (variant) {
      case "primary":
      case "danger":
        return `${baseStyles} ${sizeStyles} text-white`
      case "secondary":
        return `${baseStyles} ${sizeStyles} text-gray-900 dark:text-white`
      case "outline":
        return `${baseStyles} ${sizeStyles} text-primary`
      default:
        return `${baseStyles} ${sizeStyles} text-white`
    }
  }

  return (
    <TouchableOpacity
      className={`
        rounded-lg flex-row items-center justify-center
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled || loading ? "opacity-50" : ""}
        ${className}
      `}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading && (
        <ActivityIndicator size="small" color={variant === "outline" ? "#0F62FE" : "#FFFFFF"} className="mr-2" />
      )}
      <Text className={getTextStyles()}>{children}</Text>
    </TouchableOpacity>
  )
}
