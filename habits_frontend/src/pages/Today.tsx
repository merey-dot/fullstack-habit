
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';

import type { Habit } from '../types/habits';
import firstpage from '../images/1page.png';

import { DAYS_FULL, DAYS_SHORT, todayIndex } from '../constants/days';
import { todayKey, currentWeekKeys } from '../utils/dates';

import { useHabits } from '../hooks/useHabits';
import HabitForm from '../components/HabitForm';

import { checkIn, deleteHabit, removeCheckIn } from '../api/habits';

function Page({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F6F3E9] p-6 md:p-10">
            {children}
        </div>
    );
}

interface HeroProps {
    bg: string;
    children: ReactNode;
}

function Hero({ bg, children }: HeroProps) {
    return (
        <div className="flex flex-col md:flex-row gap-2 w-full min-h-50">
            <div className={`${bg} flex-1 rounded-md border border-black p-3`}>
                <p className="text-blue-600 font-bold text-xs">
                    {DAYS_FULL[todayIndex()]}
                </p>

                <div className="mt-5">{children}</div>
            </div>

            <div className="bg-black rounded-md md:w-60">
                <div className="flex justify-between items-center p-3">
                    <p className="text-white font-bold text-xs">
                        WEEKLY ENGINE
                    </p>

                    <div className="font-bold bg-[#FF6B57] rounded-sm text-xs px-2 py-1">
                        35
                    </div>
                </div>

                <div className="p-3 flex items-center justify-center">
                    <img
                        src={firstpage}
                        alt="Иллюстрация недельного ритма"
                        className="border-4 border-blue-500 h-50"
                    />
                </div>
            </div>
        </div>
    );
}

// Приводим дату к формату YYYY-MM-DD.
function normalizeDate(date: string): string {
    return date.slice(0, 10);
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error
        ? error.message
        : 'Не удалось сохранить изменение';
}

export default function Today() {
    const {
        habits,
        isLoading,
        error,
        refetch,
    } = useHabits();

    const [checkInError, setCheckInError] = useState('');
    const [deleteError, setDeleteError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    // Не допускаем повторных запросов для одной привычки и даты.
    const pendingActions = useRef(new Set<string>());

    // Это состояние нужно только для блокировки чекбоксов в интерфейсе.
    const [pendingKeys, setPendingKeys] = useState<Set<string>>(
        () => new Set()
    );

    const today = todayKey();
    const weekKeys = currentWeekKeys();

    const todayPlan = habits.filter((habit) =>
        habit.activeDays.includes(new Date().getDay())
    );

    const openCreateForm = () => {
        setEditingHabit(null);
        setShowCreateForm(true);
    };

    const updateHandler = (habit: Habit) => {
        setEditingHabit(habit);
        setShowCreateForm(true);
    };

    const closeHabitForm = () => {
        setShowCreateForm(false);
        setEditingHabit(null);
    };

    const checkInHandler = async (id: number, date: string) => {
        const key = `${id}:${date}`;

        if (pendingActions.current.has(key)) {
            return;
        }

        pendingActions.current.add(key);

        setPendingKeys((previous) => {
            const next = new Set(previous);
            next.add(key);
            return next;
        });

        try {
            await checkIn(id, date);
            await refetch();
        } catch (error) {
            setCheckInError(getErrorMessage(error));
        } finally {
            pendingActions.current.delete(key);

            setPendingKeys((previous) => {
                const next = new Set(previous);
                next.delete(key);
                return next;
            });
        }
    };

    const removeCheckInHandler = async (id: number, date: string) => {
        const key = `${id}:${date}`;

        if (pendingActions.current.has(key)) {
            return;
        }

        pendingActions.current.add(key);

        setPendingKeys((previous) => {
            const next = new Set(previous);
            next.add(key);
            return next;
        });

        try {
            await removeCheckIn(id, date);
            await refetch();
        } catch (error) {
            setCheckInError(getErrorMessage(error));
        } finally {
            pendingActions.current.delete(key);

            setPendingKeys((previous) => {
                const next = new Set(previous);
                next.delete(key);
                return next;
            });
        }
    };

    const openDeleteModal = (habit: Habit) => {
        setDeleteError(false);
        setHabitToDelete(habit);
    };

    const closeDeleteModal = () => {
        setHabitToDelete(null);
        setDeleteError(false);
        setIsDeleting(false);
    };

    const deleteHandler = async (id: number) => {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(false);

        try {
            await deleteHabit(id);
            setHabitToDelete(null);
            await refetch();
        } catch {
            setDeleteError(true);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <Page>
                <Hero bg="bg-[#FFD43B]">
                    <p className="font-bold text-3xl">
                        Собираем неделю...
                    </p>

                    <p className="text-xs mt-2">
                        Загружаем текущий план и отметки
                    </p>

                    <div className="bg-gray-300 w-32 h-8 mt-3 animate-pulse" />
                </Hero>

                <section className="mt-5 flex flex-col gap-1">
                    <h2 className="font-bold text-xl">
                        Неделя в движении
                    </h2>

                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="bg-white h-7 rounded animate-pulse"
                        />
                    ))}
                </section>
            </Page>
        );
    }

    if (error) {
        return (
            <Page>
                <Hero bg="bg-[#FFE0DA]">
                    <p className="font-bold text-3xl">
                        Неделя не загрузилась
                    </p>

                    <p className="text-xs mt-2">
                        Сервер не ответил. Проверь соединение и попробуй снова.
                    </p>

                    <button
                        onClick={() => void refetch()}
                        className="bg-blue-500 text-white text-xs mt-3 px-4 py-2 rounded border border-black"
                    >
                        Повторить запрос
                    </button>
                </Hero>

                <div className="border border-red-500 rounded-xl bg-white mt-3 p-5 font-bold">
                    Список временно недоступен
                </div>
            </Page>
        );
    }

    return (
        <>
            {showCreateForm && (
                <HabitForm
                    key={editingHabit?.id ?? 'new'}
                    habit={editingHabit}
                    onClose={closeHabitForm}
                    onCreated={() => {
                        void refetch();
                        closeHabitForm();
                    }}
                />
            )}

            <Page>
                <Hero bg="bg-[#FFD43B]">
                    <p className="font-bold text-3xl">
                        Сегодня в ритме
                    </p>

                    <p className="text-xs mt-2">
                        Действий в плане: {todayPlan.length}
                    </p>

                    {todayPlan.length === 0 ? (
                        <p className="text-xs mt-3">
                            На сегодня привычек нет.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {todayPlan.map((habit) => {
                                const completeToday = habit.checkins.some(
                                    (checkin) =>
                                        normalizeDate(checkin.date) === today
                                );

                                const key = `${habit.id}:${today}`;
                                const isPending = pendingKeys.has(key);

                                return (
                                    <div
                                        key={habit.id}
                                        className={`flex items-center border border-black rounded-md p-1 ${
                                            completeToday
                                                ? 'bg-green-300'
                                                : 'bg-white'
                                        }`}
                                    >
                                        <label
                                            className={`cursor-pointer ${
                                                isPending
                                                    ? 'opacity-50'
                                                    : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={completeToday}
                                                disabled={isPending}
                                                onChange={() => {
                                                    if (completeToday) {
                                                        void removeCheckInHandler(
                                                            habit.id,
                                                            today
                                                        );
                                                    } else {
                                                        void checkInHandler(
                                                            habit.id,
                                                            today
                                                        );
                                                    }
                                                }}
                                                className="sr-only"
                                            />

                                            <div
                                                className={`w-6 h-6 border border-black flex items-center justify-center rounded-md ${
                                                    completeToday
                                                        ? 'bg-[#176B45]'
                                                        : 'bg-transparent'
                                                }`}
                                            >
                                                {completeToday && (
                                                    <span className="text-black text-lg font-bold leading-none">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </label>

                                        <div className="flex flex-col ml-2">
                                            <p className="font-bold text-[11px]">
                                                {habit.title}
                                            </p>

                                            <p className="text-[7px]">
                                                {isPending
                                                    ? 'Сохраняем...'
                                                    : completeToday
                                                        ? 'Готово'
                                                        : 'Не отмечено'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Hero>

                <section className="mt-5">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-xl mb-2">
                            Неделя в движении
                        </h2>

                        <button
                            className="bg-blue-500 text-white text-xs px-4 py-2 rounded border border-black"
                            onClick={openCreateForm}
                        >
                            Добавить привычку
                        </button>
                    </div>

                    <div className="overflow-x-auto border border-black">
                        <table className="w-full min-w-160 text-xs">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-2 text-left">
                                        ПРИВЫЧКА
                                    </th>

                                    {DAYS_SHORT.map((day) => (
                                        <th key={day} className="p-2">
                                            {day}
                                        </th>
                                    ))}

                                    <th className="p-2">ЦЕЛЬ</th>
                                    <th className="p-2">СЕРИЯ</th>
                                    <th className="p-2">ДЕЙСТВИЯ</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {habits.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={10}
                                            className="p-5 text-center"
                                        >
                                            <p className="font-bold">
                                                Пока нет привычек
                                            </p>

                                            <button
                                                onClick={openCreateForm}
                                                className="mt-2 bg-blue-500 text-white px-3 py-2 rounded border border-black"
                                            >
                                                Создать первую привычку
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    habits.map((habit) => (
                                        <tr
                                            key={habit.id}
                                            className="border-t border-black"
                                        >
                                            <td className="p-2 font-bold">
                                                {habit.title}
                                            </td>

                                            {DAYS_SHORT.map((day, index) => {
                                                const isActive =
                                                    habit.activeDays.includes(
                                                        (index + 1) % 7
                                                    );

                                                const targetDate = weekKeys[index];

                                                const isDone =
                                                    typeof targetDate === 'string' &&
                                                    habit.checkins.some(
                                                        (checkin) =>
                                                            normalizeDate(
                                                                checkin.date
                                                            ) === targetDate
                                                    );

                                                return (
                                                    <td
                                                        key={day}
                                                        className="p-2 text-center"
                                                    >
                                                        {isDone ? (
                                                            <span className="flex h-7 w-6 border border-black rounded-sm font-bold text-[10px] justify-center items-center bg-[#176B45] text-white">
                                                                ✓
                                                            </span>
                                                        ) : isActive ? (
                                                            <span className="flex h-7 w-6 border border-black rounded-sm font-bold text-[10px] justify-center items-center">
                                                                {day}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-300 flex h-7 w-6 border border-black rounded-sm justify-center items-center">
                                                                --
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}

                                            <td className="p-2 text-center">
                                                {habit.weeklyGoal}
                                            </td>

                                            <td className="p-2 text-center">
                                                —
                                            </td>

                                            <td className="p-2 text-center">
                                                <button
                                                    className="text-blue-500 mr-2 cursor-pointer"
                                                    onClick={() =>
                                                        updateHandler(habit)
                                                    }
                                                >
                                                    Изменить
                                                </button>

                                                <button
                                                    className="text-red-600 cursor-pointer"
                                                    onClick={() =>
                                                        openDeleteModal(habit)
                                                    }
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </Page>

            {habitToDelete && (
                <div className="fixed flex inset-0 bg-black/50 justify-center items-center">
                    <div className="flex flex-col gap-2 justify-center items-start bg-white border-2 border-black p-4 w-70 min-h-50 rounded-xl">
                        <p className="font-bold">
                            {deleteError
                                ? 'Удаление не выполнено'
                                : 'Удалить привычку?'}
                        </p>

                        <p className="text-sm">
                            «{habitToDelete.title}» и её отметки будут удалены.
                        </p>

                        <button
                            disabled={isDeleting}
                            className="bg-red-500 border border-black text-white font-bold h-8 w-full rounded-md text-[10px] cursor-pointer disabled:opacity-50"
                            onClick={() =>
                                void deleteHandler(habitToDelete.id)
                            }
                        >
                            {isDeleting
                                ? 'Удаляем...'
                                : deleteError
                                    ? 'Попробовать снова'
                                    : 'Удалить'}
                        </button>

                        <button
                            disabled={isDeleting}
                            className="bg-white border border-black font-bold h-8 w-full rounded-md text-[10px] cursor-pointer disabled:opacity-50"
                            onClick={closeDeleteModal}
                        >
                            Не удалять
                        </button>
                    </div>
                </div>
            )}

            {checkInError && (
                <div className="fixed flex inset-0 bg-black/50 justify-center items-center">
                    <div className="flex flex-col gap-2 justify-center items-start bg-white border-2 border-black p-4 w-70 min-h-50 rounded-xl">
                        <p className="text-red-700 font-bold text-xl">
                            Не удалось изменить отметку
                        </p>

                        <p className="text-sm">
                            {checkInError}
                        </p>

                        <button
                            className="bg-white border border-black font-bold px-4 py-2 rounded-md"
                            onClick={() => setCheckInError('')}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
