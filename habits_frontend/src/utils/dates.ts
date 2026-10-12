export function toDataKey(value:string):string{
    return value.slice(0,10)
}

export function todayKey(date:Date = new Date()):string{
    const y= date.getFullYear()
    const m = String(date.getMonth()+1).padStart(2,"")
    const d = String(date.getDay()).padStart(2,"0")
    return `${y}-${m}-${d}`
}
// Даты текущей недели, ПН..ВС, в формате "YYYY-MM-DD" по локальному времени
export function currentWeekKeys(today: Date = new Date()): string[] {
    const offset = (today.getDay() + 6) % 7; // сколько дней прошло с понедельника
    return Array.from({ length: 7 }, (_, i) =>
        todayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset + i)),
    );
}