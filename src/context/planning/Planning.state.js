import React, {useReducer} from 'react';
import UserReducer from './Planning.reducer';
import PlanningContext from "./Planning.context";

import {
    DELETE_PLANNING_LARGE,
    DELETE_PLANNING_LARGE_ERROR,
    DELETE_PLANNING_LARGE_LOADING,
    DELETE_PLANNING_SHORT,
    DELETE_PLANNING_SHORT_LOADING,
    DELETE_PLANNING_SHORT_ERROR,
    EDIT_PLANNING_MEDIUM,
    EDIT_PLANNING_MEDIUM_ERROR,
    EDIT_PLANNING_MEDIUM_LOADING, GET_LECTIONARY, GET_LECTIONARY_ERROR, GET_LECTIONARY_LOADING,
    GET_PLANNING_LARGE,
    GET_PLANNING_LARGE_ERROR,
    GET_PLANNING_LARGE_LOADING,
    GET_PLANNING_MEDIUM,
    GET_PLANNING_MEDIUM_ERROR,
    GET_PLANNING_MEDIUM_LOADING,
    GET_PLANNING_SHORT,
    GET_PLANNING_SHORT_BY_DATE,
    GET_PLANNING_SHORT_BY_DATE_ERROR,
    GET_PLANNING_SHORT_BY_DATE_LOADING,
    GET_PLANNING_SHORT_ERROR,
    GET_PLANNING_SHORT_LOADING,
    GET_PLANNINGS_MEDIUM_BY_DATE,
    GET_PLANNINGS_MEDIUM_BY_DATE_ERROR,
    GET_PLANNINGS_MEDIUM_BY_DATE_LOADING,
    GET_REGISTER,
    GET_REGISTER_ERROR,
    GET_REGISTER_LOADING, SET_LECTIONARY, SET_LECTIONARY_ERROR,
    SET_LECTIONARY_LOADING,
    SET_PLANNING_LARGE,
    SET_PLANNING_LARGE_ERROR,
    SET_PLANNING_LARGE_LOADING,
    SET_PLANNING_MEDIUM,
    SET_PLANNING_MEDIUM_ERROR,
    SET_PLANNING_MEDIUM_LOADING,
    SET_PLANNING_SHORT,
    SET_PLANNING_SHORT_ERROR,
    SET_PLANNING_SHORT_LOADING,
    SET_REGISTER,
    SET_REGISTER_ERROR,
    SET_REGISTER_LOADING,
    DELETE_REGISTER, DELETE_REGISTER_ERROR, DELETE_REGISTER_LOADING
} from "./Planning.types";
import {
    deletePlanningLargeByGradeQuery,
    deletePlanningShortQuery,
    editPlanningMediumById, getLectionaryByIdQuery,
    getPlanningLargeByGradeQuery,
    getPlanningMediumByGradeQuery,
    getPlanningShortByGradeByDateQuery,
    getPlanningShortByGradeQuery,
    getRegisterQuery,
    setLectionaryQuery,
    setPlanningLargeByGradeQuery,
    setPlanningMediumQuery,
    setPlanningShortQuery,
    setRegisterQuery,
    deleteRegisterQuery
} from "@/queries/plannings";
import {
    planningLargeDecorator,
    planningLargesDecorator, planningMediumDecorator,
    planningMediumsDecorator, planningShortDecorator, planningShortsDecorator
} from "@/context/planning/Planning.decorator";

const PlanningState = (props) => {
    const initialState = {
        planningMediums: [],
        planningMediumsLoading: true,
        planningMediumsError: false,
        planningMediumsRaw: [],
        planningMediumsRawLoading: true,
        planningMediumsRawError: false,
        planningLarges: [],
        planningLargesLoading: true,
        planningLargesError: false,
        planningShorts: [],
        planningShortsLoading: true,
        planningShortsError: false,
        planningShortsLectionary: [],
        planningShortsLectionaryLoading: false,
        planningShortsLectionaryError: false,
        registers: [],
        registersLoading: true,
        registersError: false,
        lectionaries: [],
        lectionariesLoading: true,
        lectionariesError: false,
    };

    const [state, dispatch] = useReducer(UserReducer, initialState)

    const getPlanningShorts = async (grade) => {
        dispatch({
            type: GET_PLANNING_SHORT_LOADING
        });
        try {
            const response = await getPlanningShortByGradeQuery(grade)
            dispatch({
                type: GET_PLANNING_SHORT,
                payload: planningShortsDecorator(response)
            });
        } catch (e) {
            dispatch({
                type: GET_PLANNING_SHORT_ERROR
            });
        }
    }

    const getPlanningShortByDate = async (grade, date) => {
        dispatch({
            type: GET_PLANNING_SHORT_BY_DATE_LOADING
        });
        try {
            const response = await getPlanningShortByGradeByDateQuery(grade, date)
            dispatch({
                type: GET_PLANNING_SHORT_BY_DATE,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_PLANNING_SHORT_BY_DATE_ERROR
            });
        }
    }

    const getPlanningsMediumByDate = async (grade) => {
        dispatch({
            type: GET_PLANNINGS_MEDIUM_BY_DATE_LOADING
        });
        try {
            const response = await getPlanningMediumByGradeQuery(grade)
            dispatch({
                type: GET_PLANNINGS_MEDIUM_BY_DATE,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_PLANNINGS_MEDIUM_BY_DATE_ERROR
            });
        }
    }

    const getPlanningMediums = async (grade) => {
        dispatch({
            type: GET_PLANNING_MEDIUM_LOADING
        });
        try {
            const response = await getPlanningMediumByGradeQuery(grade)
            dispatch({
                type: GET_PLANNING_MEDIUM,
                payload: planningMediumsDecorator(response)
            });
        } catch (e) {
            dispatch({
                type: GET_PLANNING_MEDIUM_ERROR
            });
        }
    }

    const getPlanningLarges = async (grade) => {
        dispatch({
            type: GET_PLANNING_LARGE_LOADING
        });
        try {
            const response = await getPlanningLargeByGradeQuery(grade)
            dispatch({
                type: GET_PLANNING_LARGE,
                payload: planningLargesDecorator(response)
            });
        } catch (e) {
            dispatch({
                type: GET_PLANNING_LARGE_ERROR
            });
        }
    }

    const setPlanningLarge = async (doc) => {
        dispatch({
            type: SET_PLANNING_LARGE_LOADING
        });
        try {
            await setPlanningLargeByGradeQuery(doc)
            dispatch({
                type: SET_PLANNING_LARGE,
                payload: planningLargeDecorator(doc)
            });
        } catch (e) {
            dispatch({
                type: SET_PLANNING_LARGE_ERROR
            });
        }
    }

    const setPlanningMedium = async (doc) => {
        dispatch({
            type: SET_PLANNING_MEDIUM_LOADING
        });
        try {
            await setPlanningMediumQuery(doc)
            dispatch({
                type: SET_PLANNING_MEDIUM,
                payload: planningMediumDecorator(doc, state.planningMediums)
            });
        } catch (e) {
            dispatch({
                type: SET_PLANNING_MEDIUM_ERROR
            });
        }
    }

    const setPlanningShort = async (doc) => {
        dispatch({
            type: SET_PLANNING_SHORT_LOADING
        });
        try {
            await setPlanningShortQuery(doc)
            dispatch({
                type: SET_PLANNING_SHORT,
                payload: planningShortDecorator(doc, state.planningShorts)
            });
        } catch (e) {
            dispatch({
                type: SET_PLANNING_SHORT_ERROR
            });
        }
    }

    const setPlanningLectionary = async (doc) => {
        dispatch({
            type: SET_LECTIONARY_LOADING
        });
        try {
            await setLectionaryQuery(doc)
            dispatch({
                type: SET_LECTIONARY,
            });
        } catch (e) {
            dispatch({
                type: SET_LECTIONARY_ERROR
            });
        }
    }

    const deletePlanningLarge = async (id) => {
        dispatch({
            type: DELETE_PLANNING_LARGE_LOADING
        });
        try {
            await deletePlanningLargeByGradeQuery(id)
            dispatch({
                type: DELETE_PLANNING_LARGE,
                payload: id
            });
        } catch (e) {
            dispatch({
                type: DELETE_PLANNING_LARGE_ERROR
            });
        }
    }

    const deletePlanningShort = async (id) => {
        dispatch({
            type: DELETE_PLANNING_SHORT_LOADING
        });
        try {
            await deletePlanningShortQuery(id)
            dispatch({
                type: DELETE_PLANNING_SHORT,
                payload: id
            });
        } catch (e) {
            dispatch({
                type: DELETE_PLANNING_SHORT_ERROR
            });
        }
    }

    const editPlanningMedium = async (id) => {
        dispatch({
            type: EDIT_PLANNING_MEDIUM_LOADING
        });
        try {
            await editPlanningMediumById(id)
            dispatch({
                type: EDIT_PLANNING_MEDIUM,
                payload: id
            });
        } catch (e) {
            dispatch({
                type: EDIT_PLANNING_MEDIUM_ERROR
            });
        }
    }

    const getRegisters = async (id) => {
        dispatch({
            type: GET_REGISTER_LOADING
        });
        try {
            const response = await getRegisterQuery(id)
            dispatch({
                type: GET_REGISTER,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_REGISTER_ERROR
            });
        }
    }

    const setRegister = async (doc) => {
        dispatch({
            type: SET_REGISTER_LOADING
        });
        try {
            await setRegisterQuery(doc)
            dispatch({
                type: SET_REGISTER,
                payload: doc
            });
        } catch (e) {
            dispatch({
                type: SET_REGISTER_ERROR
            });
        }
    }

    const deleteRegister = async (id) => {
        dispatch({
            type: DELETE_REGISTER_LOADING
        });
        try {
            await deleteRegisterQuery(id)
            dispatch({
                type: DELETE_REGISTER,
                payload: id
            });
        } catch (e) {
            dispatch({
                type: DELETE_REGISTER_ERROR
            });
        }
    }
    
    const getLectionaryById = async (id) => {
        dispatch({
            type: GET_LECTIONARY_LOADING
        });
        try {
            const response = await getLectionaryByIdQuery(id)
            dispatch({
                type: GET_LECTIONARY,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_LECTIONARY_ERROR
            });
        }
    }

    return <PlanningContext.Provider
        value={{
            planningMediums: state.planningMediums,
            planningMediumsLoading: state.planningMediumsLoading,
            planningMediumsError: state.planningMediumsError,
            planningMediumsRaw: state.planningMediumsRaw,
            planningMediumsRawLoading: state.planningMediumsRawLoading,
            planningMediumsRawError: state.planningMediumsRawError,
            planningLarges: state.planningLarges,
            planningLargesLoading: state.planningLargesLoading,
            planningLargesError: state.planningLargesError,
            planningShorts: state.planningShorts,
            planningShortsLoading: state.planningShortsLoading,
            planningShortsError: state.planningShortsError,
            planningShortsLectionary: state.planningShortsLectionary,
            planningShortsLectionaryLoading: state.planningShortsLectionaryLoading,
            planningShortsLectionaryError: state.planningShortsLectionaryError,
            registers: state.registers,
            registersLoading: state.registersLoading,
            registersError: state.registersError,
            lectionaries: state.lectionaries,
            lectionariesLoading: state.lectionariesLoading,
            lectionariesError: state.lectionariesError,
            getPlanningLarges,
            setPlanningLarge,
            deletePlanningLarge,
            deletePlanningShort,
            getPlanningMediums,
            setPlanningMedium,
            editPlanningMedium,
            getPlanningShorts,
            getPlanningShortByDate,
            setPlanningShort,
            getPlanningsMediumByDate,
            getRegisters,
            setRegister,
            deleteRegister,
            setPlanningLectionary,
            getLectionaryById
        }}
    >
        {props.children}
    </PlanningContext.Provider>
}

export default PlanningState;