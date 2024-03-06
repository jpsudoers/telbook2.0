export const getStudentsByGrade = (students, grade) => students.filter(student => {
    return student.grade === grade.toUpperCase()
})

export const getStudentsByStatusActive = (students) => students.filter(student => {
    return student.state === "Activo"
})

export function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}