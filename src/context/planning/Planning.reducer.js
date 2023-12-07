import {
    DELETE_PLANNING_LARGE,
    DELETE_PLANNING_LARGE_ERROR,
    DELETE_PLANNING_LARGE_LOADING,
    EDIT_PLANNING_MEDIUM,
    EDIT_PLANNING_MEDIUM_ERROR,
    EDIT_PLANNING_MEDIUM_LOADING,
    GET_LECTIONARIES,
    GET_LECTIONARIES_ERROR,
    GET_LECTIONARIES_LOADING,
    GET_LECTIONARY, GET_LECTIONARY_ERROR,
    GET_LECTIONARY_LOADING,
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
    GET_REGISTER_LOADING,
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
    SET_REGISTER_LOADING
} from "@/context/planning/Planning.types";

const reducer = (state, action) => {
    const {payload, type} = action;
    switch (type) {
        case SET_REGISTER_LOADING:
            return {
                ...state,
                registersLoading: true,
                registersError: false,
            }
        case SET_REGISTER:
            return {
                ...state,
                registersLoading: false,
                registersError: false
            }
        case SET_REGISTER_ERROR:
            return {
                ...state,
                registersLoading: false,
                registersError: true,
            }
        case GET_REGISTER_LOADING:
            return {
                ...state,
                registersLoading: true,
                registersError: false,
            }
        case GET_REGISTER:
            return {
                ...state,
                registers: payload,
                registersLoading: false,
                registersError: false
            }
        case GET_REGISTER_ERROR:
            return {
                ...state,
                registersLoading: false,
                registersError: true,
            }
        case GET_LECTIONARY_LOADING:
            return {
                ...state,
                lectionariesLoading: true,
                lectionariesError: false,
            }
        case GET_LECTIONARY:
            return {
                ...state,
                lectionaries: payload,
                lectionariesLoading: false,
                lectionariesError: false
            }
        case GET_LECTIONARY_ERROR:
            return {
                ...state,
                lectionariesLoading: false,
                lectionariesError: true,
            }
        case GET_PLANNING_SHORT_LOADING:
            return {
                ...state,
                planningShortsLoading: true,
                planningShortsError: false,
            }
        case GET_PLANNING_SHORT:
            return {
                ...state,
                planningShorts: payload,
                planningShortsLoading: false,
                planningShortsError: false
            }
        case GET_PLANNING_SHORT_ERROR:
            return {
                ...state,
                planningShortsLoading: false,
                planningShortsError: true,
            }
        case GET_PLANNING_SHORT_BY_DATE_LOADING:
            return {
                ...state,
                planningShortsLectionaryLoading: true,
                planningShortsLectionaryError: false,
            }
        case GET_PLANNING_SHORT_BY_DATE:
            return {
                ...state,
                planningShortsLectionary: payload,
                planningShortsLectionaryLoading: false,
                planningShortsLectionaryError: false
            }
        case GET_PLANNING_SHORT_BY_DATE_ERROR:
            return {
                ...state,
                planningShortsLectionaryLoading: false,
                planningShortsLectionaryError: true,
            }
        case GET_PLANNING_MEDIUM_LOADING:
            return {
                ...state,
                planningMediumsLoading: true,
                planningMediumsError: false,
            }
        case GET_PLANNING_MEDIUM:
            return {
                ...state,
                planningMediums: payload,
                planningMediumsLoading: false,
                planningMediumsError: false
            }
        case GET_PLANNING_MEDIUM_ERROR:
            return {
                ...state,
                planningMediumsLoading: false,
                planningMediumsError: true,
            }
        case GET_PLANNINGS_MEDIUM_BY_DATE_LOADING:
            return {
                ...state,
                planningMediumsRawLoading: true,
                planningMediumsRawError: false,
            }
        case GET_PLANNINGS_MEDIUM_BY_DATE:
            return {
                ...state,
                planningMediumsRaw: payload,
                planningMediumsRawLoading: false,
                planningMediumsRawError: false
            }
        case GET_PLANNINGS_MEDIUM_BY_DATE_ERROR:
            return {
                ...state,
                planningMediumsRawLoading: false,
                planningMediumsRawError: true,
            }
        case GET_PLANNING_LARGE_LOADING:
            return {
                ...state,
                planningLargesLoading: true,
                planningLargesError: false,
            }
        case GET_PLANNING_LARGE:
            return {
                ...state,
                planningLarges: payload,
                planningLargesLoading: false,
                planningLargesError: false
            }
        case GET_PLANNING_LARGE_ERROR:
            return {
                ...state,
                planningLargesLoading: false,
                planningLargesError: true,
            }
        case SET_PLANNING_LARGE_LOADING:
            return {
                ...state,
                planningLargesLoading: true,
                planningLargesError: false,
            }
        case SET_PLANNING_LARGE:
            return {
                ...state,
                planningLarges: [
                    ...state.planningLarges,
                    payload
                ],
                planningLargesLoading: false,
                planningLargesError: false
            }
        case SET_PLANNING_LARGE_ERROR:
            return {
                ...state,
                planningLargesLoading: false,
                planningLargesError: true,
            }
        case SET_PLANNING_MEDIUM_LOADING:
            return {
                ...state,
                planningMediumsLoading: true,
                planningMediumsError: false,
            }
        case SET_PLANNING_MEDIUM:
            return {
                ...state,
                planningMediums: [
                    ...state.planningMediums,
                    payload
                ],
                planningMediumsLoading: false,
                planningMediumsError: false
            }
        case SET_PLANNING_MEDIUM_ERROR:
            return {
                ...state,
                planningMediumsLoading: false,
                planningMediumsError: true,
            }
        case SET_PLANNING_SHORT_LOADING:
            return {
                ...state,
                planningShortsLoading: true,
                planningShortsError: false,
            }
        case SET_PLANNING_SHORT:
            return {
                ...state,
                planningShorts: [
                    ...state.planningShorts,
                    payload
                ],
                planningShortsLoading: false,
                planningShortsError: false
            }
        case SET_PLANNING_SHORT_ERROR:
            return {
                ...state,
                planningShortsLoading: false,
                planningShortsError: true,
            }
        case EDIT_PLANNING_MEDIUM_LOADING:
            return {
                ...state,
                planningMediumsLoading: true,
                planningMediumsError: false,
            }
        case EDIT_PLANNING_MEDIUM:
            return {
                ...state,
                planningMediums: state.planningMediums.map(planning => {
                    if(planning.id === payload) {
                        return {
                            ...planning,
                            current: false
                        }
                    }
                    return planning
                }),
                planningMediumsLoading: false,
                planningMediumsError: false
            }
        case EDIT_PLANNING_MEDIUM_ERROR:
            return {
                ...state,
                planningMediumsLoading: false,
                planningMediumsError: true,
            }
        case DELETE_PLANNING_LARGE_LOADING:
            return {
                ...state,
                planningLargesLoading: true,
                planningLargesError: false,
            }
        case DELETE_PLANNING_LARGE:
            return {
                ...state,
                planningLarges: state.planningLarges.filter(planning => planning.id !== payload),
                planningLargesLoading: false,
                planningLargesError: false
            }
        case DELETE_PLANNING_LARGE_ERROR:
            return {
                ...state,
                planningLargesLoading: false,
                planningLargesError: true,
            }
        default:
            return state;
    }
}

export default reducer;