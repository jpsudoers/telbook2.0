export const getAllDaysInMonth = (month, year) =>
    Array.from(
        {length: new Date(year, month, 0).getDate()},
        (_, i) => new Date(year, month - 1, i + 1)
    );

export const months = [
    {name: 'Enero', code: 1},
    {name: 'Febrero', code: 2},
    {name: 'Marzo', code: 3},
    {name: 'Abril', code: 4},
    {name: 'Mayo', code: 5},
    {name: 'Junio', code: 6},
    {name: 'Julio', code: 7},
    {name: 'Agosto', code: 8},
    {name: 'Septiembre', code: 9},
    {name: 'Octubre', code: 10},
    {name: 'Noviembre', code: 11},
    {name: 'Diciembre', code: 12}
];

export const years = [
    2024
]

const today = new Date();
const offset = -300; //Timezone offset for EST in minutes.
const estDate = new Date(today.getTime() + offset*60*1000);
export const currentMonth = estDate.getMonth();
export const currentDay = estDate.getUTCDate();
export const currentYear = estDate.getFullYear();

export const dayName = estDate.toLocaleDateString('es-CL', {weekday: 'long', timeZone: 'UTC'})
export const monthName = estDate.toLocaleDateString('es-CL', {month: 'long'})

export function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    // Return array of year and week number
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}