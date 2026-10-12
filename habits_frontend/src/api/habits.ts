
export async function createHabit(data: { title: string, weeklyGoal: number, activeDays: number[]}) {
    const res = await fetch('http://localhost:3000/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    const result = await res.json()

    if (!res.ok) {
        throw result
    }
    return result
}
export async function getHabit(id: number) {
    const res = await fetch(`http://localhost:3000/habits/${id}`,{
        method:"GET"
    })
    return res.json()
}
export async function getHabits() {
    const res = await fetch(`http://localhost:3000/habits/`,{
        method:'GET'
    })
    return res.json()
}
export async function updateHabit(id: number, data: Partial<{ title: string, weeklyGoal: number, activeDays: number[] }>) {
    const res = await fetch(`http://localhost:3000/habits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return res.json()
}
export async function checkIn(id: number, date: string) {
    const res = await fetch(
        `http://localhost:3000/habits/${id}/check-ins`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        }
    )

    if (!res.ok) {
        throw new Error(`Ошибка check-in: ${res.status}`)
    }

    return res.json()
}

export async function removeCheckIn(id: number, date: string) {
    const res = await fetch(
        `http://localhost:3000/habits/${id}/check-ins/${date}`,
        {
            method: 'DELETE'
        }
    )

    if (!res.ok) {
        throw new Error('Не удалось убрать отметку')
    }

    return res.json()
}
export async function deleteHabit(id: number) {
    const res = await fetch(`http://localhost:3000/habits/${id}`, {
        method: 'DELETE'
    })
    return res.json()
}