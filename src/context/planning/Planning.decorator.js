import React from "react";

export const planningMediumsDecorator = (planningMediums) => planningMediums.map((plannings, index) => {
    console.log(plannings)
    return {
        id: plannings.id,
        key: index,
        data: {
            name: plannings.proyectoEje
        },
        current: plannings.vigencia,
        children: [
            {
                key: `${index}-0`,
                data: {
                    name: `Objetivos de aprendizaje`
                },
                children: plannings.oas.map((oa, idx) => {
                    return {
                        key: `${index}-0-${idx}`,
                        data: {
                            name: 'Ambito: ' + oa.ambitoSeleccionado.toLowerCase() + '. Nucleo: ' + oa.nucleoSeleccionado.toLowerCase() + '. Objetivo seleccionado: ' + oa.oaSeleccionado.toLowerCase()
                        },
                    }
                }),
            },
            {
                key: `${index}-1`,
                data: {
                    name: `Proyecto: ${plannings.proyectoEje}`
                }
            },
            {
                key: `${index}-2`,
                data: {
                    name: `Estrategias: ${plannings.estrategias}`
                }
            },
            {
                key: `${index}-3`,
                data: {
                    name: `Objetivos: ${plannings.objetivos}`
                }
            },
            {
                key: `${index}-4`,
                data: {
                    name: `Cierrre: ${plannings.cierre}`
                }
            },
        ]
    }
})

export const planningShortsDecorator = (planningShorts) => planningShorts.map((planning, index) => {
    console.log(planningShorts)
    const estrategias = planning.estrategias.map((estrategia, idx) => {
        return {
            key: `${index}-${idx}`,
            data: {
                name: "Estrategias de aprendizaje"
            },
            children: [
                {
                    key: `00`,
                    data: {
                        name: estrategia.ambitoSeleccionado,
                        title: 'Ámbito'
                    },
                },
                {
                    key: `01`,
                    data: {
                        name: estrategia.nucleoSeleccionado,
                        title: 'Núcleo'
                    },
                },
                {
                    key: `03`,
                    data: {
                        name: estrategia.oaSeleccionado,
                        title: 'Objetivo de aprendizaje'
                    },
                },
            ]
        }
    })
    const dayName = new Date(planning.fecha).toLocaleDateString('es-CL', {weekday: 'long', timeZone: 'UTC'})
    const day = new Date(planning.fecha).getUTCDate()
    const year = new Date(planning.fecha).getFullYear()
    const monthName = new Date(planning.fecha).toLocaleDateString('es-CL', {month: 'long'})

    return {
        id: planning.id,
        key: index,
        date: planning.fecha,
        data: {
            name: dayName + " " + day + " de " + monthName + " de " + year
        },
        children: [
            ...estrategias,
            {
                data: {
                    name: planning.recursos,
                    title: 'Recursos'
                },
            },
            {
                data: {
                    name: planning.instrumentos,
                    title: 'Intrumentos de evaluación'
                },
            },
            {
                data: {
                    name: planning.inicio,
                    title: 'Inicio, desarrollo y cierre'
                },
            },
        ]
    }
})

export const planningLargesDecorator = (plannings) => plannings.map(planning => {
    return {
        id: planning.id,
        date: planning.fecha,
        description: planning.texto,
    }
})

export const planningLargeDecorator = (planning) => {
    return {
        id: planning.id,
        date: planning.fecha,
        description: planning.texto,
    }
}

export const planningMediumDecorator = (planning, totalPlannings) => {
    return {
        id: planning.id,
        key: totalPlannings.length,
        data: {
            name: planning.proyectoEje
        },
        current: planning.vigencia,
        children: [
            {
                key: `${totalPlannings.length}-0`,
                data: {
                    name: `Objetivos de aprendizaje`
                },
                children: planning.oas.map((oa, idx) => {
                    return {
                        key: `${totalPlannings.length}-0-${idx}`,
                        data: {
                            name: 'Ambito: ' + oa.ambitoSeleccionado.toLowerCase() + '. Nucleo: ' + oa.nucleoSeleccionado.toLowerCase() + '. Objetivo seleccionado: ' + oa.oaSeleccionado.toLowerCase()
                        },
                    }
                }),
            },
            {
                key: `${totalPlannings.length}-1`,
                data: {
                    name: `Proyecto: ${planning.proyectoEje}`
                }
            },
            {
                key: `${totalPlannings.length}-2`,
                data: {
                    name: `Estrategias: ${planning.estrategias}`
                }
            },
            {
                key: `${totalPlannings.length}-3`,
                data: {
                    name: `Objetivos: ${planning.objetivos}`
                }
            },
            {
                key: `${totalPlannings.length}-4`,
                data: {
                    name: `Cierrre: ${planning.cierre}`
                }
            },
        ]
    }
}

export const planningShortDecorator = (planning, totalPlannings) => {
    const estrategias = planning.estrategias.map((estrategia, idx) => {
        return {
            key: `${totalPlannings.length}-${idx}`,
            data: {
                name: "Estrategias de aprendizaje"
            },
            children: [
                {
                    key: `00`,
                    data: {
                        name: estrategia.ambitoSeleccionado,
                        title: 'Ámbito'
                    },
                },
                {
                    key: `01`,
                    data: {
                        name: estrategia.nucleoSeleccionado,
                        title: 'Núcleo'
                    },
                },
                {
                    key: `03`,
                    data: {
                        name: estrategia.oaSeleccionado,
                        title: 'Objetivo de aprendizaje'
                    },
                },
            ]
        }
    })
    const dayName = new Date(planning.fecha).toLocaleDateString('es-CL', {weekday: 'long', timeZone: 'UTC'})
    const day = new Date(planning.fecha).getUTCDate()
    const year = new Date(planning.fecha).getFullYear()
    const monthName = new Date(planning.fecha).toLocaleDateString('es-CL', {month: 'long'})
    return {
        id: planning.id,
        key: totalPlannings.length,
        date: planning.fecha,
        data: {
            name: dayName + " " + day + " de " + monthName + " de " + year
        },
        children: [
            ...estrategias,
            {
                data: {
                    name: planning.recursos,
                    title: 'Recursos'
                },
            },
            {
                data: {
                    name: planning.instrumentos,
                    title: 'Intrumentos de evaluación'
                },
            },
            {
                data: {
                    name: planning.inicio,
                    title: 'Inicio, desarrollo y cierre'
                },
            },
        ]
    }
}