import { useState, useCallback, useEffect } from "react";
import { Grid, Page, Select, AlphaCard } from "@shopify/polaris";
import dayjs from "dayjs";

import { BoxLoading, DateCard } from "../components";
import { useAuthenticatedFetch } from "../hooks";
import { getByMYNoteAPI } from "../rest";

const weekdays = [
  { long: "Sunday", short: "Sun" },
  { long: "Monday", short: "Mon" },
  { long: "Tuesday", short: "Tue" },
  { long: "Wednesday", short: "Wed" },
  { long: "Thursday", short: "Thu" },
  { long: "Friday", short: "Fri" },
  { long: "Saturday", short: "Sat" },
];

const months = [
  { long: "January", short: "Jan" },
  { long: "February", short: "Feb" },
  { long: "March", short: "Mar" },
  { long: "April", short: "Apr" },
  { long: "May", short: "May" },
  { long: "June", short: "Jun" },
  { long: "July", short: "Jul" },
  { long: "August", short: "Aug" },
  { long: "September", short: "Sep" },
  { long: "October", short: "Oct" },
  { long: "November", short: "Nov" },
  { long: "December", short: "Dec" },
];

const daysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const firstWeekDayInMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export default function HomePage() {
  const fetcher = useAuthenticatedFetch();

  const [notes, setNotes] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const handleMonthChange = useCallback(
    (value) => setSelectedMonth(+value),
    []
  );
  const handleYearChange = useCallback((value) => setSelectedYear(+value), []);

  const handleGetNotes = async () => {
    setPageLoading(true);
    const res = await getByMYNoteAPI(fetcher, {
      month: selectedMonth,
      year: selectedYear,
    });
    setNotes(res.data);
    setPageLoading(false);
  };

  useEffect(() => {
    handleGetNotes();
  }, [selectedMonth, selectedYear]);

  return (
    <Page fullWidth>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Select
          label="Month"
          options={months.map((m, index) => {
            return {
              label: m.long,
              value: index,
            };
          })}
          onChange={handleMonthChange}
          value={selectedMonth}
        />
        <Select
          label="Year"
          options={Array.from(
            { length: 5 },
            (_, i) => dayjs().year() - 2 + i
          ).map((year) => ({
            label: year,
            value: year,
          }))}
          onChange={handleYearChange}
          value={selectedYear}
        />
      </div>

      {pageLoading ? (
        <BoxLoading />
      ) : (
        <div className="grid-container">
          {weekdays.map((day) => (
            <p
              key={day.short}
              style={{
                textAlign: "center",
                width: "fit-content",
              }}
            >
              {day.long}
            </p>
          ))}

          {[
            ...Array(firstWeekDayInMonth(selectedYear, selectedMonth)).keys(),
          ].map((emp, index) => (
            <div
              className="grid-item"
              key={index}
              style={{ backgroundColor: "lightgray" }}
            >
              {"-"}
            </div>
          ))}
          {Array.from(
            { length: daysInMonth(selectedYear, selectedMonth) },
            (_, i) => i + 1
          ).map((date, index) => (
            <DateCard
              date={date}
              month={selectedMonth}
              year={selectedYear}
              notes={notes?.filter((note) => note.date === date)}
              index={index}
              today={
                dayjs().year() === selectedYear &&
                dayjs().month() === selectedMonth &&
                dayjs().date() === date
              }
            />
          ))}
        </div>
      )}
    </Page>
  );
}
