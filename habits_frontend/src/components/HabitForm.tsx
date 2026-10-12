import { useState } from 'react'

import { createHabit, updateHabit } from "../api/habits";
import { type CreateHabitData, type Habit,} from '../types/habits';

import { titleValidation, activeDaysValidation, weeklyGoalValidation } from '../utils/validation';
const DAYS_SHORT = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
interface Props {
    onClose: () => void;
    onCreated: () => void
    habit: Habit|null
}

export default function HabitForm({ habit, onClose, onCreated }: Props) {
    const [title, setTitle] = useState<string>(habit?.title ?? "")
    const [activeDays, setActiveDays] = useState<number[]>(habit?.activeDays ?? [])
    const [weeklyGoal, setWeeklyGoal] = useState<string>(habit ? String(habit.weeklyGoal) : '')

    const [serverError, setServerError] = useState<{ field?: string; message: string } | null>(null)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const [titleError, setTitleError] = useState<string | null>(null)
    const [activeDaysError, setActiveDaysError] = useState<string | null>(null)
    const [weeklyGoalError, setWeeklyGoalError] = useState<string | null>(null)
    function toggleDay(day: number) {
        setActiveDays(prev => (
            prev?.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        ))
    }
    async function submitHandler() {
        setIsFetching(true)

        try {
            const titleError = titleValidation(title)
            const activeDaysError = activeDaysValidation(activeDays)
            const weeklyGoalError = weeklyGoalValidation(weeklyGoal, activeDays)

            setTitleError(titleError)
            setActiveDaysError(activeDaysError)
            setWeeklyGoalError(weeklyGoalError)

            if (titleError || activeDaysError || weeklyGoalError) {
                return
            }

            const data: CreateHabitData = {
                title,
                weeklyGoal: Number(weeklyGoal),
                activeDays
            }
            if (habit) {
                await updateHabit(habit.id, data)
            } else {
                await createHabit(data)
            }

            onCreated()
            onClose()

        } catch (e) {
            const field =
                typeof e === "object" &&
                    e !== null &&
                    "field" in e &&
                    typeof e.field === "string"
                    ? e.field
                    : undefined

            setServerError({
                field,
                message: e instanceof Error
                    ? e.message
                    : "Что-то пошло не так"
            })
        } finally {
            setIsFetching(false)
        }
    }
    return (
        <div className="fixed z-50 inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white rounded-md border border-black pt-3  h-100 flex flex-col ">
                <div className="  p-3 pt-5 w-[35vw]">
                    <p className="font-bold">Новая привычка</p>
                    <p className="text-[7px]">Выберите ритм который реально повторить.</p>

                    {/* HABIT TITLE */}
                    <label className="font-bold text-[8px]">Название привычки*</label>
                    <input className="border-2 text-[9px] font-bold pl-2 border-purple-600 rounded-md w-full h-7 "
                        placeholder="Например читать 20минут"
                        value={title}
                        onChange={e => setTitle(e.target.value)}></input>
                    <p className={titleError ? " text-red-700 text-[8px] font-bold" : "text-[7px]  font-bold"}>{titleError}</p>

                    {/* ACTIVE DAYS */}
                    <p className="font-bold text-[7px] mt-4">АКТИВНЫЕ ДНИ</p>
                    <div className="flex gap-2">
                        {DAYS_SHORT.map((label, i) => {
                            const day = (1 + i) % 7
                            const selected = activeDays.includes(day)
                            return (

                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => toggleDay(day)}
                                    className={selected ? "bg-amber-400 font-bold rounded border border-black p-2 text-[7px]"
                                        : activeDaysError
                                            ? "bg-white font-bold rounded border-2 border-red-700 p-2 text-[7px]"
                                            : "bg-white font-bold rounded border border-black p-2 text-[7px]"}

                                >{label}
                                </button>

                            )
                        })}

                    </div>
                    {activeDaysError && (
                        <p className="text-[7px] text-red-700 font-bold">{activeDaysError}</p>
                    )}
                    {/* Week goal */}
                    <p className="text-[7px] font-bold mt-1">Выберите дни когда привычка входит в план.</p>
                    <label className="font-bold text-[8px]">Цель на неделю</label>
                    <input className={weeklyGoalError
                        ? "border border-red-700 w-full pl-2 text-[7px] font-bold p-2 rounded-md"
                        : "border border-black w-full pl-2 text-[7px] font-bold p-2 rounded-md"}
                        type="number"
                        value={weeklyGoal}
                        onChange={e => setWeeklyGoal(e.target.value)}
                    ></input>
                    {weeklyGoalError && (
                        <p className="text-[7px] text-red-700 font-bold">{weeklyGoalError}</p>
                    )}

                    {isFetching && <div className="w-full border rounded-md mt-3 border-blue-600 bg-blue-300 text-blue-600">Не закрывайте панель</div>}
                    <button
                        onClick={() => submitHandler()}
                        className="bg-blue-500 border border-black w-full text-white rounded-md font-bold text-[8px] pt-1.5 pb-1.5 mt-2">
                        {isFetching ? "Сохроняем..." :habit?"Изменить": "Создать привычку"}
                    </button>
                    <button className=" border border-black w-full  rounded-md font-bold text-[8px] pt-1.5 pb-1.5"
                        onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    )


}