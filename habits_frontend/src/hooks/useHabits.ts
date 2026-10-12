import { type Habit} from '../types/habits'
import { getHabits } from '../api/habits'
import {useState,useEffect} from 'react'
export function useHabits(){
    const [habits,setHabits] = useState<Habit[]>([])
    const [isLoading,setIsLoading] = useState(true)
    const [error,setError] = useState<string|null>(null)
  
    async function loadHabits(){
        try{
            
            const habit = await getHabits()
            setHabits(habit)
            setIsLoading(false)
        }catch(e){
            setError(e instanceof Error? e.message:'Something went wrong')
        }
    }
    useEffect(()=>{
        loadHabits()
    },[])
    function updateHabitLocally(id: number, updater: (habit: Habit) => Habit) {
    setHabits((prev) => prev.map((h) => (h.id === id ? updater(h) : h)))
}
    return {habits,isLoading,error,refetch:loadHabits,updateHabitLocally}
}