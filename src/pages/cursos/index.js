import React from 'react';
import Header from "@/components/commons/Header/Header";
import Container from "@/components/commons/Container/Container";
import LandingHome from "@/components/cursos/LandingHome/LandingHome";
import Footer from "@/components/commons/Footer/Footer";
import withAuth from "@/hoc/withAuth";

const Grades = () => {
    return (
        <>
            <Header/>
            <Container>
                <LandingHome/>
            </Container>
            {/*<Footer/>*/}
        </>
    );
};

export default withAuth(Grades);