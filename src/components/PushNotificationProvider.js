"use client"

import { useEffect } from "react"
import { usePushNotifications } from "../hooks/usePushNotifications"

export function PushNotificationProvider({ children }) {
  const { pushToken, isEnabled } = usePushNotifications()

  useEffect(() => {
    if (pushToken) {
      console.log("Push notifications ready with token:", pushToken)
    }
  }, [pushToken])

  return children
}
