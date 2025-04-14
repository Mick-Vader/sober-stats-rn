import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from 'expo-font';
import { useEffect, useReducer, useState } from "react";

import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_900Black } from '@expo-google-fonts/inter/900Black';
import { Inter_600SemiBold_Italic } from '@expo-google-fonts/inter/600SemiBold_Italic';

import { AVG_CALORIES_PER_DRINK, AVG_DRINKING_DAYS_PER_WEEK, AVG_DRINKS_PER_SESSION, AVG_PRICE_PER_DRINK } from "./constants";
import "../index.css";

export default function SoberScreen() {
  let [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_900Black,
    Inter_600SemiBold_Italic,
  });

  const [weeksSober, setWeeksSober] = useState(0)
  const [daysSober, setDaysSober] = useState(0)
  const [hoursSober, setHoursSober] = useState(346)

  const [moneySaved, setMoneySaved] = useState('')
  const [caloriesAvoided, setCaloriesAvoided] = useState('')
  const [hFWEDays, setHFWEDays] = useState('')

  /**
   * Calculates the total money saved by staying sober.
   * This is based on the average price per drink, average number of drinks per session,
   * average drinking days per week, and the number of weeks sober.
   * 
   * @returns {string} A string representation of the calculated money saved, rounded to two decimal places.
   */

  function calculateMoneySaved(): string {
    return `€${Math.round((weeksSober * AVG_DRINKING_DAYS_PER_WEEK) * (AVG_DRINKS_PER_SESSION * AVG_PRICE_PER_DRINK) * 10 + Number.EPSILON) / 10}`;
  }

  /**
   * Calculates the total calories avoided by staying sober.
   * This is based on the average calories per drink, average number of drinks per session,
   * average drinking days per week, and the number of weeks sober.
   * 
   * @returns {string} A string representation of the calculated calories avoided, rounded to two decimal places.
   */
  function calculateCaloriesAvoided(): string {
    return `${Math.round((weeksSober * AVG_DRINKING_DAYS_PER_WEEK) * (AVG_DRINKS_PER_SESSION * AVG_CALORIES_PER_DRINK) * 10 + Number.EPSILON) / 10}`;
  }

  /**
   * Calculates the Hangover Free Weekend Days (HFWEDays).
   * This is based on the average drinking days per week adjusted by a factor of 1.5
   * and the number of weeks sober.
   * 
   * @returns {string} A string representation of the calculated HFWEDays, rounded to two decimal places.
   */

  function calculateHFWEDays(): string {
    return `${Math.round((weeksSober * (AVG_DRINKING_DAYS_PER_WEEK * 1.5) + Number.EPSILON) * 10) / 10}`;
  }
  

  useEffect(() => {
    if(hoursSober > 0) {
      setDaysSober(Math.round((hoursSober / 24 + Number.EPSILON) * 10) / 10);
      const weeks = Math.round((hoursSober / (24 * 7) + Number.EPSILON) * 10) / 10;
      setWeeksSober(weeks);

      const money = calculateMoneySaved();
      const calories = calculateCaloriesAvoided();
      const hFWE = calculateHFWEDays();

      setMoneySaved(money);
      setCaloriesAvoided(calories);
      setHFWEDays(hFWE);

    } else {
      setDaysSober(0);
      setWeeksSober(0);
      setMoneySaved('Nothing');
      setCaloriesAvoided('No');
      setHFWEDays('No');
    }
  }, [])

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 items-center pt-20 bg-white p-4">
      <TouchableOpacity
        // TODO: Add a click function to change format i.e. Days to Weeks to Hours and back again
        onPress={() => null}
        className="p-4 items-center"
      >
        <Text
          style={{ fontFamily: "Inter_900Black" }}
          className="text-9xl font-bold text-black pt-1"
        >
          {daysSober}
        </Text>
        <Text
          style={{ fontFamily: "Inter_600SemiBold" }}
          className="text-6xl font-semibold text-black mb-8 pb-2 pt-2"
        >
          Days Sober
        </Text>
      </TouchableOpacity>
      <View className="w-full rounded-2xl border border-gray-300 p-6">
        <Text
          style={{ fontFamily: "Inter_600SemiBold_Italic" }}
          className="text-3xl font-semibold text-black mb-4 text-center"
        >
          The Stats
        </Text>
        <FlatList
          data={[{name: 'saved', value: moneySaved}, {name: 'calories avoided', value: caloriesAvoided}, {name: 'weekend days hangover free', value: hFWEDays}]}
          renderItem={({item}) => (
            <Text
              className="text-2xl text-black border-b border-gray-300 px-4 py-2"
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
      </View>
    </SafeAreaView>
  );
}
