import { type Habit } from "../types/habits";
interface HabitListProps {
    habits: Habit[];
    className?: string;
}

export default function HabitList({
    habits,
    className = "",
}: HabitListProps) {
    return (
        <div className={`grid grid-cols-2 gap-2 ${className}`}>
            {habits.map((habit) => (
                <div key={habit.id}>
                    {habit.title}
                </div>
            ))}
        </div>
    );
}