import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, View, Image, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import StravaProfileScreen from './screens/StravaProfileScreen';
import PlanScreen from './screens/PlanScreen';
import { colors, fonts } from './constants/theme';
import OnboardingPopup from './components/OnboardingPopup';
import { API_CONFIG } from './config/api.config';
import { storageService } from './services/storageService';

export type RootStackParamList = {
  MainTabs: undefined;
};

export type MainTabParamList = {
  Plan: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Plan') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: fonts.weights.bold,
          fontFamily: fonts.family,
        },
      })}
    >
      <Tab.Screen
        name="Plan"
        component={PlanScreen}
        options={{ title: 'Plan' }}
      />
      <Tab.Screen
        name="Profile"
        component={StravaProfileScreen}
        options={{ title: 'Mon profil' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const appFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const hideSplash = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(appFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSplash(false);
      });
    };

    const init = async () => {
      const hasPlan = await storageService.hasTrainingPlan();

      if (!hasPlan) {
        setShowLoader(true);
        const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
        const ping = axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`).catch(() => {});
        await Promise.all([minDelay, ping]);
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      hideSplash();
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <Animated.View style={[styles.appContainer, { opacity: appFadeAnim }]}>
        <NavigationContainer>
          {!showSplash && <OnboardingPopup />}
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: fonts.weights.bold,
            fontFamily: fonts.family,
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
        </NavigationContainer>
      </Animated.View>
      {showSplash && (
        <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
          <Image
            source={require('./assets/splash_screen.png')}
            style={styles.splashImage}
            resizeMode="contain"
          />
          {showLoader && (
            <ActivityIndicator
              size="small"
              color={colors.textMuted}
              style={styles.loader}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appContainer: {
    flex: 1,
  },
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    bottom: 60,
  },
});
