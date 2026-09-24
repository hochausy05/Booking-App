import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, fontSize } from '../constants/theme';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { RoomDetailScreen } from '../screens/RoomDetailScreen';
import { RoomsScreen } from '../screens/RoomsScreen';
import type { RootTabParamList, RoomsStackParamList } from './navigationTypes';

const Tab = createBottomTabNavigator<RootTabParamList>();
const RoomsStack = createNativeStackNavigator<RoomsStackParamList>();

function RoomsNavigator() {
  return (
    <RoomsStack.Navigator>
      <RoomsStack.Screen
        component={RoomsScreen}
        name="RoomsHome"
        options={{ headerShown: false }}
      />
      <RoomsStack.Screen
        component={RoomDetailScreen}
        name="RoomDetail"
        options={{ title: 'Chi tiết phòng', headerBackTitle: 'Phòng học' }}
      />
    </RoomsStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Rooms"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedText,
          tabBarLabelStyle: { fontSize: fontSize.caption },
          tabBarStyle: { backgroundColor: colors.surface },
        }}
      >
        <Tab.Screen component={RoomsNavigator} name="Rooms" options={{ title: 'Phòng học' }} />
        <Tab.Screen
          component={MyBookingsScreen}
          name="MyBookings"
          options={{ title: 'Lịch đặt phòng' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
