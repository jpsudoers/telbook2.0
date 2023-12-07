export const filterPlanningByMonth = (plannings, month) => {
    return plannings.filter(planning => {
        const date = new Date(planning.publishedAt.toDate())
        const monthDate = date.getMonth()
        return monthDate === parseInt(month)
    }).map(planning => {
        return {
            name: planning.proyectoEje,
            oas: planning.oas,
        }
    })
}