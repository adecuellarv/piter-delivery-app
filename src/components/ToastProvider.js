"use client"

import { View } from "react-native"
import { Toast } from "./Toast"
import { useToastStore } from "../utils/toast"

export function ToastProvider({ children }) {
  const { toasts, hideToast } = useToastStore()

  return (
    <View className="flex-1">
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onHide={() => hideToast(toast.id)}
        />
      ))}
    </View>
  )
}
