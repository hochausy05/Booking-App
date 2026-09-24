export type RoomDateOption = {
  dateKey: string;
  weekday: string;
  dayNumber: string;
  isToday: boolean;
};

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNextSevenDates(from: Date = new Date()): RoomDateOption[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const todayKey = toDateKey(start);
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return {
      dateKey: toDateKey(date),
      weekday: weekdays[date.getDay()],
      dayNumber: String(date.getDate()),
      isToday: toDateKey(date) === todayKey,
    };
  });
}

export function formatDateForSummary(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return `${day} thg ${month}, ${year}`;
}
