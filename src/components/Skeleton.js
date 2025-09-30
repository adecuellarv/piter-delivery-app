"use client"

import { useEffect, useRef } from "react"
import { View, Animated } from "react-native"

export function Skeleton({ width = "100%", height = 20, borderRadius = 4, className = "", ...props }) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )

    animation.start()

    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      className={`bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        opacity,
      }}
      {...props}
    />
  )
}

export function SkeletonCard({ className = "", ...props }) {
  return (
    <View className={`p-md bg-white dark:bg-gray-800 rounded-card ${className}`} {...props}>
      <Skeleton height={20} className="mb-2" />
      <Skeleton height={16} width="70%" className="mb-3" />
      <View className="flex-row justify-between">
        <Skeleton height={14} width="40%" />
        <Skeleton height={14} width="30%" />
      </View>
    </View>
  )
}
