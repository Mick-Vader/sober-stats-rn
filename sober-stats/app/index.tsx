import { FlatList, SafeAreaView, Text, TouchableOpacity, View, Modal } from "react-native";
import { useFonts } from 'expo-font';
import { useEffect, useMemo, useState } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_900Black } from '@expo-google-fonts/inter/900Black';
import { Inter_600SemiBold_Italic } from '@expo-google-fonts/inter/600SemiBold_Italic';
import { AlexBrush_400Regular } from '@expo-google-fonts/alex-brush'
import { DancingScript_400Regular } from '@expo-google-fonts/dancing-script'

import { AVG_CALORIES_PER_DRINK, AVG_DRINKING_DAYS_PER_WEEK, AVG_DRINKS_PER_SESSION, AVG_PRICE_PER_DRINK, INSPIRATIONAL_IRISH_QUOTES } from "./constants";
import { DatePicker } from '../components/nativewindui/DatePicker'
import { Button } from '../components/nativewindui/Button'
import "../index.css";

export default function SoberScreen() {
  let [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_900Black,
    Inter_600SemiBold_Italic,
    AlexBrush_400Regular,
    DancingScript_400Regular
  });
  const today = new Date();

  const randomQuote = INSPIRATIONAL_IRISH_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_IRISH_QUOTES.length)];

  const [isModalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const [displayMode, setDisplayMode] = useState('days');
  const [savedDate, setSavedDate] = useState<Date | null>(null);

  const [weeksSober, setWeeksSober] = useState(0);
  const [daysSober, setDaysSober] = useState(0);
  const [hoursSober, setHoursSober] = useState(0);

  const [stats, setStats] = useState({
    moneySaved: '',
    caloriesAvoided: '',
    hFWEDays: '',
  });

  const statsData = useMemo(() => [
    { name: 'saved', value: stats.moneySaved },
    { name: 'calories avoided', value: stats.caloriesAvoided },
    { name: 'weekend days hangover free', value: stats.hFWEDays },
  ], [stats]);

  /**
   * Calculates the total money saved by staying sober.
   * This is based on the average price per drink, average number of drinks per session,
   * average drinking days per week, and the number of weeks sober.
   * 
   * @returns {string} A string representation of the calculated money saved, rounded to two decimal places.
   */

  function calculateMoneySaved(weeks: number): string {
    return `€${Math.round((weeks * AVG_DRINKING_DAYS_PER_WEEK) * (AVG_DRINKS_PER_SESSION * AVG_PRICE_PER_DRINK) * 10 + Number.EPSILON) / 10}`;
  }

  /**
   * Calculates the total calories avoided by staying sober.
   * This is based on the average calories per drink, average number of drinks per session,
   * average drinking days per week, and the number of weeks sober.
   * 
   * @returns {string} A string representation of the calculated calories avoided, rounded to two decimal places.
   */
  function calculateCaloriesAvoided(weeks: number): string {
    return `${Math.round((weeks * AVG_DRINKING_DAYS_PER_WEEK) * (AVG_DRINKS_PER_SESSION * AVG_CALORIES_PER_DRINK) * 10 + Number.EPSILON) / 10}`;
  }

  /**
   * Calculates the Hangover Free Weekend Days (HFWEDays).
   * This is based on the average drinking days per week adjusted by a factor of 1.5
   * and the number of weeks sober.
   * 
   * @returns {string} A string representation of the calculated HFWEDays, rounded to two decimal places.
   */

  function calculateHFWEDays(weeks: number): string {
    return `${Math.round((weeks * (AVG_DRINKING_DAYS_PER_WEEK * 1.5) + Number.EPSILON) * 10) / 10}`;
  }

  function handleSetSavedDate() {
    setSavedDate(date);
    setModalVisible(false);
  }

  function handleStats() {
    const days = Math.round((hoursSober / 24 + Number.EPSILON) * 10) / 10;
    const weeks = Math.round((hoursSober / (24 * 7) + Number.EPSILON) * 10) / 10;
  
    setDaysSober(days);
    setWeeksSober(weeks);
  
    setStats({
      moneySaved: calculateMoneySaved(weeks),
      caloriesAvoided: calculateCaloriesAvoided(weeks),
      hFWEDays: calculateHFWEDays(weeks),
    });
  }

  function getHoursSober(soberStartDate: string) {
    const soberStart = new Date(soberStartDate);
    const timeDifference = today.getTime() - soberStart.getTime();
    return Math.round(timeDifference / (1000 * 60 * 60));
  }

  const toggleDisplayMode = () => {
    if (displayMode === 'days') setDisplayMode('hours');
    else if (displayMode === 'hours') setDisplayMode('weeks');
    else setDisplayMode('days');
  };


  useEffect(() => {
    const retrieveData = async () => {
      try {
        const soberStartDate = await AsyncStorage.getItem('sober_start_date')
        if(soberStartDate == null) {
          setModalVisible(true)
        } else {
          setHoursSober(getHoursSober(soberStartDate))
        }
      } catch (e) {
        console.error(e)
      }
    }
    retrieveData();
    if(hoursSober > 0) {
      handleStats();
    } else {
      setDaysSober(0);
      setWeeksSober(0);
      setStats({
        moneySaved: 'Nothing',
        caloriesAvoided: 'No',
        hFWEDays: 'No',
      })
    }
  }, [])

  useEffect(() => {
    if (!savedDate || savedDate === null) return;
    const timeDifference = today.getTime() - savedDate.getTime();
    setHoursSober(Math.round(timeDifference / (1000 * 60 * 60)));
    const setSoberStartDateInStorage = async () => {
      try {
        await AsyncStorage.setItem('sober_start_date', savedDate.toISOString())
      } catch (e) {
        console.error(e)
      }
    }
    setSoberStartDateInStorage();
  }, [savedDate])

  useEffect(() => {
    handleStats();
  }, [hoursSober])

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 items-center pt-10 bg-white p-4">
      <Modal
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-11/12 max-w-md h-1/5 justify-center">
          <DatePicker
            value={date}
            mode="date"
            onChange={(ev) => {
                setDate(new Date(ev.nativeEvent.timestamp));
            }}
            maximumDate={today}
            materialDateLabel=""
            materialDateLabelClassName="hidden"
          />
            <Button
              onPress={() => handleSetSavedDate()}
              className="mt-4 p-2 bg-black rounded"
            >
              <Text style={{ fontFamily: "Inter_600SemiBold" }} className="text-white">
                Set Sober Start Day
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={toggleDisplayMode} className="w-full">
        <Text
          style={{ fontFamily: "Inter_900Black" }}
          className="text-9xl font-bold text-black pt-1 text-center"
        >
          {displayMode === 'days'
            ? daysSober
            : displayMode === 'hours'
            ? hoursSober
            : weeksSober}
        </Text>
        <Text
          style={{ fontFamily: "Inter_600SemiBold" }}
          className="text-6xl font-semibold text-black mb-8 pb-2 pt-2 text-center"
        >
          {displayMode === 'days'
            ? daysSober === 1 ? 'Day Sober' : 'Days Sober'
            : displayMode === 'hours'
            ? hoursSober === 1 ? 'Hour Sober' : 'Hours Sober'
            : weeksSober === 1 ? 'Week Sober' : 'Weeks Sober'}
        </Text>
      </TouchableOpacity>
      <View className="w-full rounded-2xl border border-gray-300 p-6">
        <Text
          style={{ fontFamily: "Inter_600SemiBold_Italic" }}
          className="text-3xl font-semibold text-black mb-4 text-center"
        >
          The Stats
        </Text>
        {
          weeksSober >= 1 ? (
          <FlatList
          data={statsData}
          renderItem={({item}) => (
            <Text
              className="text-2xl text-black border-gray-300 px-4 py-2"
            >
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className="text-2xl text-black px-4 py-2"
              >
                {item.value}
              </Text>
              <Text
                className="text-2xl text-black px-4 py-2"
              >
                &nbsp;{item.name}
              </Text>
            </Text>
          )}
          keyExtractor={item => item.name}
        />
          ) : (
            <Text className="text-xl text-black mb-4 text-center">Check back in a few days!</Text>
          )
        }
      </View>
      <View className="flex-row gap-3">
        <Text className="text-5xl text-center text-black pt-12" style={{ fontFamily: 'DancingScript_400Regular' }}>
          {randomQuote}
        </Text>
      </View>
    </SafeAreaView>
  );
}
