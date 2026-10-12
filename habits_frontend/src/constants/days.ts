export const DAYS_SHORT = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

export const DAYS_FULL = [
    "ПОНЕДЕЛЬНИК",
    "ВТОРНИК",
    "СРЕДА",
    "ЧЕТВЕРГ",
    "ПЯТНИЦА",
    "СУББОТА",
    "ВОСКРЕСЕНЬЕ",
];

// JS: getDay() → 0 = воскресенье. Переводим в индекс с понедельника (0 = ПН).
export function todayIndex(date: Date = new Date()): number {
    return (date.getDay() + 6) % 7;
}