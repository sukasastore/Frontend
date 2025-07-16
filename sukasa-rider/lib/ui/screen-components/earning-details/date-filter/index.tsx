// Utils
import { useApptheme } from "@/lib/context/global/theme.context";
import { CustomContinueButton } from "@/lib/ui/useable-components";

// Interfaces
import {
  IEarningDetailsMainProps,
  IEarningsDateFilterProps,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Icons
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// Core
import { Text, TouchableOpacity, View } from "react-native";

// React Native Calendars
import { Calendar, DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

export default function EarningDetailsDateFilter({
  dateFilter,
  setDateFilter,
  handleFilterSubmit,
  isFiltering,
  isDateFilterVisible,
  setIsDateFilterVisible,
  refetchDeafult,
}: IEarningDetailsMainProps & IEarningsDateFilterProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // Handlers
  const handleDayPress = (day: DateData) => {
    const { dateString } = day;

    // If the user clicks on the already selected start date, reset selection
    if (dateFilter.startDate === dateString && !dateFilter.endDate) {
      setDateFilter({ startDate: "", endDate: "" });
      return;
    }

    // If no startDate or both startDate and endDate exist, reset the selection
    if (!dateFilter.startDate || (dateFilter.startDate && dateFilter.endDate)) {
      setDateFilter({ startDate: dateString, endDate: "" });
    } else {
      // If startDate exists but no endDate, set endDate only if it's after startDate
      if (new Date(dateString) >= new Date(dateFilter.startDate)) {
        setDateFilter((prev) => ({ ...prev, endDate: dateString }));
      } else {
        // Swap if the user selects an earlier date for the endDate
        setDateFilter({ startDate: dateString, endDate: "" });
      }
    }
  };

  // Generate the marked dates
  const getMarkedDates = () => {
    const markedDates: MarkedDates = {};

    if (dateFilter.startDate) {
      markedDates[dateFilter.startDate] = {
        startingDay: true,
        marked: true,
        color: appTheme.primary,
        dotColor: appTheme.primary,
        selectedColor: appTheme.primary,
        selectedTextColor: appTheme.primary,
        textColor: appTheme.primary,
      };
    }

    if (dateFilter.endDate) {
      markedDates[dateFilter.endDate] = {
        endingDay: true,
        marked: true,
        color: appTheme.primary,
        dotColor: appTheme.primary,
        selectedColor: appTheme.primary,
        selectedTextColor: appTheme.primary,
        textColor: appTheme.primary,
      };

      // Mark the dates in between
      const currentDate = new Date(dateFilter.startDate!);
      const endDate = new Date(dateFilter.endDate);

      while (currentDate < endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = currentDate.toISOString().split("T")[0];
        if (dateString !== dateFilter.endDate) {
          markedDates[dateString] = {};
        }
      }
    }

    return markedDates;
  };

  const datesBeGetter = getMarkedDates();
  return (
    <View className="p-4" style={{ backgroundColor: appTheme.themeBackground }}>
      <View className="flex flex-row items-center justify-between w-full px-2">
        <TouchableOpacity
          onPress={() => setIsDateFilterVisible((prev) => !prev)}
          className="flex flex-row gap-2 items-center"
        >
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="filter" color={appTheme.primary} size={25} />
            <Text style={{ color: appTheme.fontMainColor }}>
              {t("Date Filter")}
            </Text>
          </View>
        </TouchableOpacity>
        {(dateFilter.startDate || dateFilter.endDate) && (
          <TouchableOpacity
            onPress={() => {
              setDateFilter({ endDate: "", startDate: "" });
              refetchDeafult({
                startDate: "",
                endDate: "",
              });
            }}
          >
            <View className="flex flex-row items-center gap-2">
              <Ionicons name="remove-sharp" color={"red"} size={25} />
              <Text style={{ color: appTheme.fontSecondColor }}>
                {t("Clear Filters")}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      {isDateFilterVisible && (
        <View style={{ backgroundColor: appTheme.themeBackground }}>
          <Calendar
            enableSwipeMonths={true}
            initalDate={""}
            style={{
              backgroundColor: appTheme.themeBackground,
              color: appTheme.mainTextColor,
            }}
            headerStyle={{
              backgroundColor: appTheme.themeBackground,
              color: appTheme.mainTextColor,
            }}
            onDayPress={(day: DateData) => handleDayPress(day)}
            markedDates={{
              ...datesBeGetter,
            }}
          />
          <CustomContinueButton
            onPress={() => handleFilterSubmit()}
            style={{ marginTop: 12 }}
            title={isFiltering ? t("Please Wait") : t("Apply Filter")}
            disabled={isFiltering}
          />
        </View>
      )}
    </View>
  );
}
