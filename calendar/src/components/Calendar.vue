<template>
  <div class="calendar">
    <div class="header">
      <button @click="prevMonth">←</button>
      <span>{{ currentMonthName }}, {{ currentYear }}</span>
      <button @click="nextMonth">→</button>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="day in weekDays" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody :key="forceKey">
        <tr v-for="(week, index) in gridWeeks" :key="index">
          <td
            v-for="cell in week"
            :key="cell.id"
            @click="selectCell(cell)"
            :class="{ selected: cell.isSelected, today: cell.isToday }"
          >
            {{ cell.label }}
          </td>
        </tr>
      </tbody>
    </table>
    <label>
      Язык:
      <select v-model="currentLocale">
        <option value="ru-RU">Русский</option>
        <option value="en-US">Английский</option>
      </select>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { DateTime } from "luxon";

interface Cell {
  label: string;
  id: string;
  isSelected: boolean;
  isToday: boolean;
}

const currentLocale = ref("ru-RU");

// Текущая дата
const currentDate = ref(
  DateTime.now().setZone("local").setLocale(currentLocale.value)
);

const forceKey = ref(0);

// Названия дней недели
const weekDays = computed(() => {
  const dt = DateTime.now().setLocale(currentLocale.value);
  return ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index:any) =>
    dt.set({ weekday: index + 1 }).toFormat("EEE")
  );
});

// Название текущего месяца
const currentMonthName = computed(() => currentDate.value.toFormat("LLLL"));

// Текущий год
const currentYear = computed(() => currentDate.value.toFormat("y"));

// Смена месяца
const prevMonth = () => {
  currentDate.value = currentDate.value.minus({ months: 1 });
};

const nextMonth = () => {
  currentDate.value = currentDate.value.plus({ months: 1 });
};

// сетка календаря
const gridWeeks = computed(() => {
  const weeks: Cell[][] = [];
  const startOfMonth = currentDate.value.startOf("month");
  const endOfMonth = currentDate.value.endOf("month");

  // первая неделя начинается с определенного дня
  const firstDayIndex = startOfMonth.weekday - 1;
  const emptyBeforeStart = Array(firstDayIndex).fill({
    label: "",
    id: "",
    isSelected: false,
    isToday: false,
  });

  // массив всех дней месяца
  const daysInMonth = Array.from({ length: endOfMonth.day }).map((_, i) => ({
    label: (i + 1).toString(),
    id: `${currentYear.value}-${currentMonthName.value}-${i + 1}`,
    isSelected: false,
    isToday: currentDate.value.hasSame(startOfMonth.plus({ days: i }), "day"),
  }));

  // пустые ячейки после последнего дня месяца
  const lastDayIndex = endOfMonth.weekday;
  const emptyAfterEnd = Array(7 - lastDayIndex).fill({
    label: "",
    id: "",
    isSelected: false,
    isToday: false,
  });

  // массив ячеек
  const allCells = [...emptyBeforeStart, ...daysInMonth, ...emptyAfterEnd];

  // таблица по неделям
  for (let i = 0; i < allCells.length; i += 7) {
    weeks.push(allCells.slice(i, i + 7));
  }

  return weeks;
});

// выбор даты
const selectCell = (cell: Cell) => {
  if (cell.isSelected) return;
  gridWeeks.value.forEach((week) =>
    week.forEach((c) => (c.isSelected = false))
  );
  cell.isSelected = true;
  forceKey.value++;
};

watch(currentLocale, (newLocale) => {
  currentDate.value = DateTime.now().setZone("local").setLocale(newLocale);
});
</script>

<style scoped>
.calendar {
  width: 300px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  font-weight: bold;
}

.header button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

table {
  width: 100%;
  border-spacing: 0;
  table-layout: fixed;
}

thead th {
  text-align: center;
  height: 30px;
  line-height: 30px;
  background-color: #ddd;
}

tbody td {
  height: 30px;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}

.selected {
  background-color: blue;
  color: white;
  font-weight: bold;
}

.today {
  font-weight: bold;
  border: 1px solid blue;
}
</style>
