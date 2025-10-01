import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { DeliveryHome } from './src/pages/DeliveryHome';
import './global.css'; 

export default function App() {
  return (
    <View style={styles.container}>
      <DeliveryHome />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
