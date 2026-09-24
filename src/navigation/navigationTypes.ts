import type { NavigatorScreenParams } from '@react-navigation/native';

export type RoomsStackParamList = {
  RoomsHome: undefined;
  RoomDetail: undefined;
};

export type RootTabParamList = {
  Rooms: NavigatorScreenParams<RoomsStackParamList> | undefined;
  MyBookings: undefined;
};
