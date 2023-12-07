import React, {useReducer} from 'react';
import UserReducer from './User.reducer';
import UserContext from "./User.context";
import {signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "@/firebase_setup/firebase";
import {
    CLEAN_GRADES,
    GET_BASES,
    GET_BASES_ERROR,
    GET_BASES_LOADING,
    GET_GRADES,
    GET_GRADES_ERROR,
    GET_GRADES_LOADING,
    GET_SPEECH_BASES,
    GET_SPEECH_BASES_ERROR,
    GET_SPEECH_BASES_LOADING,
    POST_USER,
    POST_USER_ERROR,
    POST_USER_ERROR_TABLE,
    POST_USER_LOADING,
    POST_USER_LOADING_TABLE,
    POST_USER_TABLE
} from "./User.types";
import {getUserQuery} from "@/queries/user";
import {getGradesQuery} from "@/queries/grades";
import {getBases, getSpeechBasesQuery} from "@/queries/bases";

export const initialState = {
    userAuth: {},
    userAuthLoading: true,
    userAuthError: false,
    user: {},
    userLoading: true,
    userError: false,
    grades: [],
    gradesLoading: true,
    gradesError: false,
    bases: [],
    basesLoading: true,
    basesError: false,
    speechBases: [],
    speechBasesLoading: true,
    speechBasesError: false,
};

const UserState = (props) => {
    const [state, dispatch] = useReducer(UserReducer, initialState)

    const cleanGrades= () => {
        dispatch({
            type: CLEAN_GRADES
        });
    };

    const loginUser = async (values) => {
        dispatch({
            type: POST_USER_LOADING
        });
        try {
            const response = await signInWithEmailAndPassword(auth, values.email, values.password)
            dispatch({
                type: POST_USER,
                payload: response.user
            });
        } catch (e) {
            dispatch({
                type: POST_USER_ERROR
            });
        }
    };

    const logoutUser = async () => {
        dispatch({
            type: POST_USER_LOADING
        });
        try {
            await signOut(auth)
            dispatch({
                type: POST_USER,
                payload: {}
            });
        } catch (e) {
            dispatch({
                type: POST_USER_ERROR
            });
        }
    };

    const getUser = async (uid) => {
        dispatch({
            type: POST_USER_LOADING_TABLE
        });
        try {
            const response = await getUserQuery(uid)
            dispatch({
                type: POST_USER_TABLE,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: POST_USER_ERROR_TABLE
            });
        }
    }

    const getGrades = async (establecimiento) => {
        dispatch({
            type: GET_GRADES_LOADING
        });
        try {
            const response = await getGradesQuery(establecimiento)
            dispatch({
                type: GET_GRADES,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_GRADES_ERROR
            });
        }
    }

    const getCurricularBases = async (level) => {
        dispatch({
            type: GET_BASES_LOADING
        });
        try {
            const response = await getBases(level)
            dispatch({
                type: GET_BASES,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_BASES_ERROR
            });
        }
    }

    const getSpeechBases = async (level) => {
        dispatch({
            type: GET_SPEECH_BASES_LOADING
        });
        try {
            const response = await getSpeechBasesQuery(level)
            dispatch({
                type: GET_SPEECH_BASES,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_SPEECH_BASES_ERROR
            });
        }
    }

    return <UserContext.Provider
        value={{
            userAuth: state.userAuth,
            userAuthLoading: state.userAuthLoading,
            userAuthError: state.userAuthError,
            user: state.user,
            userLoading: state.userLoading,
            userError: state.userError,
            grades: state.grades,
            gradesLoading: state.gradesLoading,
            gradesError: state.gradesError,
            bases: state.bases,
            basesLoading: state.basesLoading,
            basesError: state.basesError,
            speechBases: state.speechBases,
            speechBasesLoading: state.speechBasesLoading,
            speechBasesError: state.speechBasesError,
            loginUser,
            logoutUser,
            getUser,
            getGrades,
            getCurricularBases,
            cleanGrades,
            getSpeechBases,
        }}
    >
        {props.children}
    </UserContext.Provider>
}

export default UserState;