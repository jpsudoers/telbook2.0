import {
    CLEAN_GRADES,
    GET_BASES, GET_BASES_ERROR, GET_BASES_LOADING,
    GET_GRADES, GET_GRADES_ERROR,
    GET_GRADES_LOADING, GET_SPEECH_BASES, GET_SPEECH_BASES_ERROR, GET_SPEECH_BASES_LOADING,
    POST_USER, POST_USER_ERROR, POST_USER_ERROR_TABLE, POST_USER_LOADING, POST_USER_LOADING_TABLE, POST_USER_TABLE,
} from "./User.types";
import {initialState} from "@/context/user/User.state";

const reducer = (state, action) => {
    const {payload, type} = action;

    switch (type) {
        case POST_USER_LOADING:
            return {
                ...state,
                userAuthLoading: true,
                userAuthError: false,
            }
        case POST_USER:
            return {
                ...state,
                userAuth: payload,
                userAuthLoading: false,
                userAuthError: false
            }
        case POST_USER_ERROR:
            return {
                ...state,
                userAuthLoading: false,
                userAuthError: true,
            }
        case POST_USER_LOADING_TABLE:
            return {
                ...state,
                userLoading: true,
                userError: false,
            }
        case POST_USER_TABLE:
            return {
                ...state,
                user: payload,
                userLoading: false,
                userError: false
            }
        case POST_USER_ERROR_TABLE:
            return {
                ...state,
                userLoading: false,
                userError: true,
            }
        case GET_GRADES_LOADING:
            return {
                ...state,
                gradesLoading: true,
                gradesError: false,
            }
        case GET_GRADES:
            return {
                ...state,
                grades: payload,
                gradesLoading: false,
                gradesError: false
            }
        case GET_GRADES_ERROR:
            return {
                ...state,
                gradesLoading: false,
                gradesError: true,
            }
        case GET_BASES_LOADING:
            return {
                ...state,
                basesLoading: true,
                basesError: false,
            }
        case GET_BASES:
            return {
                ...state,
                bases: payload,
                basesLoading: false,
                basesError: false
            }
        case GET_BASES_ERROR:
            return {
                ...state,
                basesLoading: false,
                basesError: true,
            }
        case GET_SPEECH_BASES_LOADING:
            return {
                ...state,
                speechBasesLoading: true,
                speechBasesError: false,
            }
        case GET_SPEECH_BASES:
            return {
                ...state,
                speechBases: payload,
                speechBasesLoading: false,
                speechBasesError: false
            }
        case GET_SPEECH_BASES_ERROR:
            return {
                ...state,
                speechBasesLoading: false,
                speechBasesError: true,
            }
        case CLEAN_GRADES:
            return {
                ...state,
                grades: [],
                gradesLoading: false,
                gradesError: false,
            }
        default:
            return state;

    }
}

export default reducer;