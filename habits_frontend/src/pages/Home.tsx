import firstpage from "../images/1page.png";
import  { DAYS_SHORT, DAYS_FULL, todayIndex } from "../constants/days";

interface StatCardProps {
    value: string;
    label: string;
    className: string;
}

function StatCard({ value, label, className }: StatCardProps) {
    return (
        <div className={`rounded-[3px] border border-black p-2 ${className}`}>
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs">{label}</p>
        </div>
    );
}

export default function Home() {
    const today = todayIndex();

    return (
        <div className="min-h-screen bg-[#F6F3E9] flex flex-col md:flex-row gap-8 p-6 md:p-10 justify-between">
            <header className="w-full md:w-100 flex flex-col justify-between gap-8">
                <div className="flex gap-2 items-center">
                    <div className="bg-blue-700 h-5 w-5 border-black border"></div>
                    <p className="text-lg font-bold">РИТМ.</p>
                    <p className="text-blue-500 text-xs font-bold">WEEK 35</p>
                </div>

                <h1 className="text-4xl font-bold">
                    Неделя, которая движется вместе с вами.
                </h1>

                <div className="flex gap-2">
                    <StatCard
                        value="11/23"
                        label="отметок недели"
                        className="bg-[#FFD43B] w-32"
                    />
                    <StatCard
                        value="2/3"
                        label="сегодня"
                        className="bg-[#D9FBE8] w-28"
                    />
                </div>
            </header>

            <main className="w-full md:w-72">
                <div className="bg-blue-700">
                    <div className="flex justify-between items-center p-3">
                        <div className="text-white text-xs font-bold">
                            WEEKLY ENGINE
                        </div>
                        <div className="bg-red-400 px-2 rounded border border-black font-bold text-xs">
                            35
                        </div>
                    </div>
                    <img src={firstpage} alt="Иллюстрация недельного ритма" />
                </div>

                <div className="bg-black p-3">
                    <p className="text-yellow-300 text-xs font-bold">
                        {DAYS_FULL[today]}
                    </p>
                    <div className="flex justify-around gap-1 mt-1.5">
                        {DAYS_SHORT.map((day, i) => (
                            <div
                                key={day}
                                className={`rounded-md border font-bold text-xs p-2 ${
                                    i === today
                                        ? "bg-yellow-300 text-black border-yellow-300"
                                        : "text-white border-white"
                                }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}