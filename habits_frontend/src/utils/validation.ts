export function titleValidation(title: string) {
    if (!title.trim()) {
        return "Введите название привычки";
    }
    return null;
}
export function activeDaysValidation(days: number[]) {
    if (days.length === 0) {
        return "Выберите хотябы один день";
    }
    return null;
}
export function weeklyGoalValidation(weeklyGoal: string, activeDays: number[]) {
    if (!weeklyGoal.trim()) {
        return "Введите недельную цель";
    }
    if (Number(weeklyGoal) > activeDays.length) {
        return "Недельная цель не может перевысть количество активных дней";
    }
    return null;
}
