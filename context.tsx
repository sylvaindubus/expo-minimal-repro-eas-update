import { createContext, ReactNode, useState } from "react"
import { Alert } from "react-native"
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from "expo-updates"
import Constants from "expo-constants"

export enum UpdateStatus {
  Unchecked = "unchecked",
  CannotCheckUpdate = "cannotCheckUpdate",
  NeedManualUpdate = "needManualUpdate",
  NeedAutoUpdate = "needAutoUpdate",
  UpToDate = "upToDate",
}

type ContextType = {
  status: UpdateStatus
  check: () => Promise<boolean>
}

const Context = createContext<ContextType>({
  status: UpdateStatus.Unchecked,
  check: async () => true,
})

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState(UpdateStatus.Unchecked)

  const check = async () => {
    if (__DEV__) return true

    const config = { min_version: "1.0.0" }
    const minVersion = config?.min_version
    const currentVersion = Constants?.expoConfig?.version
    if (!minVersion || !currentVersion) {
      setStatus(UpdateStatus.CannotCheckUpdate)
      return false
    }

    if (currentVersion < minVersion) {
      setStatus(UpdateStatus.NeedManualUpdate)
      return false
    }

    try {
      await checkForUpdateAsync()
    } catch (e) {
      Alert.alert(e.message)
      return false
    }

    const { isAvailable } = await checkForUpdateAsync()
    if (isAvailable) {
      setStatus(UpdateStatus.NeedAutoUpdate)

      fetchUpdateAsync().finally(() => {
        reloadAsync()
      })

      return false
    }

    setStatus(UpdateStatus.UpToDate)
    return true
  }

  return <Context.Provider value={{ status, check }}>{children}</Context.Provider>
}

export const ContextConsumer = Context.Consumer

export default Context
