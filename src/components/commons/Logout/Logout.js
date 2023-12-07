import React, {useContext} from 'react';
import {useRouter} from "next/router";
import Button from "@/components/commons/Button/Button";
import UserContext from "@/context/user/User.context";
import StudentContext from "@/context/students/Students.context";

const Logout = () => {
    const {
        cleanGrades,
        logoutUser,
    } = useContext(UserContext);

    const {
        clearStudent
    } = useContext(StudentContext);

    const router = useRouter();

    const onSignOut = async () => {
        await cleanGrades();
        await clearStudent();
        await logoutUser();
        await router.push('/');
    }

    return (
        <>
            <Button onClick={onSignOut} type={'logout'} text={'Salir'}/>
        </>
    );
};

export default Logout;