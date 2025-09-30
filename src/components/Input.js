import { forwardRef } from "react"
import { View, TextInput, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export const Input = forwardRef(
  ({ label, error, leftIcon, rightIcon, className = "", containerClassName = "", ...props }, ref) => {
    return (
      <View className={`${containerClassName}`}>
        {label && <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</Text>}

        <View className="relative">
          {leftIcon && (
            <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <Ionicons name={leftIcon} size={20} color="#9AA0A6" />
            </View>
          )}

          <TextInput
            ref={ref}
            className={`
            bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
            rounded-lg px-4 py-3 text-base text-gray-900 dark:text-white
            min-h-[44px]
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${error ? "border-danger" : "focus:border-primary"}
            ${className}
          `}
            placeholderTextColor="#9AA0A6"
            {...props}
          />

          {rightIcon && (
            <View className="absolute right-3 top-1/2 -translate-y-1/2">
              <Ionicons name={rightIcon} size={20} color="#9AA0A6" />
            </View>
          )}
        </View>

        {error && <Text className="text-sm text-danger mt-1">{error}</Text>}
      </View>
    )
  },
)

Input.displayName = "Input"
