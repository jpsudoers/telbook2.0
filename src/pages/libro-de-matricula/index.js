import React, {useContext} from 'react';
import Header from "@/components/commons/Header/Header";
import Container from "@/components/commons/Container/Container";
import LandingBookRegister from "@/components/registration/LandingBookRegister/LandingBookRegister";
import withAuth from "@/hoc/withAuth";
import UserContext from "@/context/user/User.context";
import {useRouter} from "next/router";

const RegistrationBook = () => {
    const {
        user,
    } = useContext(UserContext);
    const router = useRouter();

    if (Object.values(user).length === 0) {
        router.push('/cursos')
    }

    return (
        <div>
            <div>
                <Header/>
                <Container>
                    <LandingBookRegister/>
                </Container>
            </div>
        </div>
    );
};

export default withAuth(RegistrationBook);