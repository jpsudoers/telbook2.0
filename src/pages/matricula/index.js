import React, {useEffect, useContext} from 'react';
import Header from "@/components/commons/Header/Header";
import Container from "@/components/commons/Container/Container";
import withAuth from "@/hoc/withAuth";
import FormRegister from "@/components/matricula/FormRegister";
import Title from "@/components/commons/Title/Title";
import UserContext from "@/context/user/User.context";
import {AuthContext} from "@/context/auth/Auth.context";
import StudentsContext from "@/context/students/Students.context";

const RegistrationBook = () => {
    const {
        user,
        getGrades,
        grades,
        getUser,
    } = useContext(UserContext);

    const {
        userAuth,
    } = useContext(AuthContext);

    const {
        students,
        getStudentsBySchool,
    } = useContext(StudentsContext);

    useEffect(() => {
        if (Object.values(user).length === 0) {
            getUser(userAuth.uid)
        }
        debugger
        if (grades.length === 0) {
            getGrades(user.establecimiento)
        }
        if (students.length === 0) {
            getStudentsBySchool(user.establecimiento)
        }
    }, [user])

    return (
        <div>
            <div>
                <Header/>
                <Container>
                    <Title title='Matricular alumno'/>
                    <FormRegister/>
                </Container>
            </div>
        </div>
    );
};

export default withAuth(RegistrationBook);