import { useEffect, useContext, useState, useCallback } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import Context, { ContextProvider } from "./context"

SplashScreen.preventAutoHideAsync()

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { color: "white", fontWeight: "bold" },
})

const Content = () => {
  const { status, check } = useContext(Context)
  const [appLoaded, setAppLoaded] = useState(false)
  const [fontLoaded] = useFonts({
    /* eslint-disable global-require */
    OpenSans: require("./assets/fonts/OpenSans-Regular.ttf"),
    OpenSansSemiBold: require("./assets/fonts/OpenSans-SemiBold.ttf"),
    OpenSansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
    /* eslint-enable global-require */
  })

  const init = async () => {
    const upToDate = await check()
    setAppLoaded(true)
    if (!upToDate) return
  }

  useEffect(() => {
    init()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appLoaded && fontLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [appLoaded, fontLoaded])

  if (!appLoaded || !fontLoaded) {
    return null
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text style={styles.text}>Update status: {status}</Text>
    </View>
  )
}

const App = () => (
  <ContextProvider>
    <Content />
  </ContextProvider>
)

export default App
