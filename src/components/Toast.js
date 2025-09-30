"use client"

import { useEffect, useRef } from "react"
import { View, Text, Animated, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"

const { width } = Dimensions.get("window")

export function Toast({ visible, message, type = "info", duration = 3000, onHide, position = "top" }) {
  const translateY = useRef(new Animated.Value(position === "top" ? -100 : 100)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      switch (type) {
        case "success":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          break
        case "error":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          break
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }

      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Auto hide
      const timer = setTimeout(() => {
        hide()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible])

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === "top" ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide()
    })
  }

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return { bg: "bg-success", icon: "checkmark-circle" }
      case "error":
        return { bg: "bg-danger", icon: "alert-circle" }
      case "warning":
        return { bg: "bg-warning", icon: "warning" }
      default:
        return { bg: "bg-primary", icon: "information-circle" }
    }
  }

  if (!visible) return null

  const { bg, icon } = getTypeStyles()

  return (
    <Animated.View
      className={`absolute ${position === "top" ? "top-12" : "bottom-12"} left-4 right-4 z-50`}
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View className={`${bg} rounded-lg p-4 flex-row items-center shadow-lg`}>
        <Ionicons name={icon} size={24} color="white" />
        <Text className="text-white font-medium ml-3 flex-1">{message}</Text>
      </View>
    </Animated.View>
  )
}
