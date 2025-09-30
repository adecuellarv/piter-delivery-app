import { View } from "react-native"
import { shadows } from "../theme/tokens"

export function Card({ children, className = "", shadow = "md", ...props }) {
  const shadowStyle = shadows[shadow] || shadows.md

  return (
    <View className={`bg-white dark:bg-gray-800 rounded-card p-md ${className}`} style={shadowStyle} {...props}>
      {children}
    </View>
  )
}
