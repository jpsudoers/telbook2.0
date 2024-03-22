import {
    CLEAN_STUDENT, EDIT_STUDENT, EDIT_STUDENT_RAW, EDIT_STUDENT_ERROR, EDIT_STUDENT_LOADING,
    GET_ATTENDANCE,
    GET_ATTENDANCE_ERROR,
    GET_ATTENDANCE_LOADING,
    GET_ATTENDANCES,
    GET_ATTENDANCES_ERROR,
    GET_ATTENDANCES_LOADING, GET_EVALUATIONS,
    GET_EVALUATIONS_BY_OA,
    GET_EVALUATIONS_BY_OA_ERROR,
    GET_EVALUATIONS_BY_OA_LOADING, GET_EVALUATIONS_ERROR,
    GET_EVALUATIONS_LOADING,
    GET_OBSERVATIONS,
    GET_OBSERVATIONS_ERROR,
    GET_OBSERVATIONS_LOADING,
    GET_SCHOOL_REGISTERS,
    GET_SCHOOL_REGISTERS_ERROR,
    GET_SCHOOL_REGISTERS_LOADING,
    GET_STUDENTS,
    GET_STUDENTS_ERROR,
    GET_STUDENTS_LOADING, REMOVE_STUDENT, REMOVE_STUDENT_ERROR, REMOVE_STUDENT_LOADING,
    SET_ATTENDANCE,
    SET_ATTENDANCE_ERROR,
    SET_ATTENDANCE_LOADING,
    SET_STUDENT,
    SET_STUDENT_ERROR,
    SET_STUDENT_LOADING
} from "@/context/students/Students.types";
import {initialStateStudent} from "@/context/students/Students.state";

const reducer = (state, action) => {
    const {payload, type} = action;

    switch (type) {
        case GET_EVALUATIONS_BY_OA_LOADING:
            return {
                ...state,
                evaluationByOaLoading: true,
                evaluationByOaError: false,
            }
        case GET_EVALUATIONS_BY_OA:
            return {
                ...state,
                evaluationByOa: payload,
                evaluationByOaLoading: false,
                evaluationByOaError: false,
            }
        case GET_EVALUATIONS_BY_OA_ERROR:
            return {
                ...state,
                evaluationByOaLoading: false,
                evaluationByOaError: true,
            }
        case GET_EVALUATIONS_LOADING:
            return {
                ...state,
                evaluationLoading: true,
                evaluationError: false,
            }
        case GET_EVALUATIONS:
            return {
                ...state,
                evaluation: payload,
                evaluationLoading: false,
                evaluationError: false,
            }
        case GET_EVALUATIONS_ERROR:
            return {
                ...state,
                evaluationLoading: false,
                evaluationError: true,
            }
        case GET_SCHOOL_REGISTERS_LOADING:
            return {
                ...state,
                schoolRegistersLoading: true,
                schoolRegistersError: false,
            }
        case GET_SCHOOL_REGISTERS:
            return {
                ...state,
                schoolRegisters: payload,
                schoolRegistersLoading: false,
                schoolRegistersError: false,
            }
        case GET_SCHOOL_REGISTERS_ERROR:
            return {
                ...state,
                schoolRegistersLoading: false,
                schoolRegistersError: true,
            }
        case GET_STUDENTS_LOADING:
            return {
                ...state,
                studentsLoading: true,
                studentsError: false,
            }
        case GET_STUDENTS:
            return {
                ...state,
                students: payload.students,
                studentsRaw: payload.studentsRaw,
                studentsLoading: false,
                studentsError: false,
            }
        case GET_STUDENTS_ERROR:
            return {
                ...state,
                studentsLoading: false,
                studentsError: true,
            }
        case EDIT_STUDENT_LOADING:
            return {
                ...state,
                studentsLoading: true,
                studentsError: false,
            }
        case EDIT_STUDENT:
            return {
                ...state,
                students: payload,
                studentsLoading: false,
                studentsError: false,
            }
        case EDIT_STUDENT_RAW:
            return {
                ...state,
                studentsRaw: payload,
                studentsLoading: false,
                studentsError: false,
            }
        case EDIT_STUDENT_ERROR:
            return {
                ...state,
                studentsLoading: false,
                studentsError: true,
            }
        case REMOVE_STUDENT_LOADING:
            return {
                ...state,
                studentsLoading: true,
                studentsError: false,
            }
        case REMOVE_STUDENT:
            return {
                ...state,
                students: payload,
                studentsLoading: false,
                studentsError: false,
            }
        case REMOVE_STUDENT_ERROR:
            return {
                ...state,
                studentsLoading: false,
                studentsError: true,
            }
        case GET_ATTENDANCE_LOADING:
            return {
                ...state,
                attendanceLoading: true,
                attendanceError: false,
            }
        case GET_ATTENDANCE:
            return {
                ...state,
                attendance: payload,
                attendanceLoading: false,
                attendanceError: false,
            }
        case GET_ATTENDANCE_ERROR:
            return {
                ...state,
                attendanceLoading: false,
                attendanceError: true,
            }
        case GET_ATTENDANCES_LOADING:
            return {
                ...state,
                attendancesLoading: true,
                attendancesError: false,
            }
        case GET_ATTENDANCES:
            return {
                ...state,
                attendances: payload,
                attendancesLoading: false,
                attendancesError: false,
            }
        case GET_ATTENDANCES_ERROR:
            return {
                ...state,
                attendancesLoading: false,
                attendancesError: true,
            }
        case GET_OBSERVATIONS_LOADING:
            return {
                ...state,
                observationsLoading: true,
                observationsError: false,
            }
        case GET_OBSERVATIONS:
            return {
                ...state,
                observations: payload,
                observationsLoading: false,
                observationsError: false,
            }
        case GET_OBSERVATIONS_ERROR:
            return {
                ...state,
                observationsLoading: false,
                observationsError: true,
            }
        case SET_STUDENT_LOADING:
            return {
                ...state,
                studentsLoading: true,
                studentsError: false,
            }
        case SET_STUDENT:
            return {
                ...state,
                students: [
                    payload,
                    ...state.students
                ],
                studentsLoading: false,
                studentsError: false,
            }
        case SET_STUDENT_ERROR:
            return {
                ...state,
                studentsLoading: false,
                studentsError: true,
            }
        case SET_ATTENDANCE_LOADING:
            return {
                ...state,
                attendancesLoading: true,
                attendancesError: false,
            }
        case SET_ATTENDANCE:
            return {
                ...state,
                attendancesLoading: false,
                attendancesError: false,
            }
        case SET_ATTENDANCE_ERROR:
            return {
                ...state,
                attendancesLoading: false,
                attendancesError: true,
            }
        case CLEAN_STUDENT:
            return {
                ...initialStateStudent
            }
        default:
            return state;

    }
}

export default reducer;