export interface Habit {
    id: number
    title: string
    weeklyGoal: number
    activeDays: number[]
    checkins:CheckIn[]
    createdAt: string
    updatedAt: string
}

export interface CreateHabitData {
    title: string
    weeklyGoal: number
    activeDays: number[]
}

export interface CheckIn{
    id:number
    habitId:number
    date:string
}
