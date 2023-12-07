import {useContext, useEffect} from "react";
import {Formik} from 'formik';
import {InputText} from 'primereact/inputtext';
import Container from "@/components/commons/Container/Container";
import Logo from "@/components/commons/Svg/Logo/Logo";
import Button from "@/components/commons/Button/Button";
import Label from "@/components/commons/Label/Label";
import style from './index.module.scss';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Alert from "@/components/commons/Alert/Alert";
import UserContext from "@/context/user/User.context";
import {useRouter} from "next/router";
import withAuth from "@/hoc/withAuth";
import {AuthContext} from "@/context/auth/Auth.context";

const Home = () => {
    const {
        loginUser,
        getUser,
        userAuthError,
    } = useContext(UserContext);

    const {
        userAuth
    } = useContext(AuthContext);

    const router = useRouter();

    useEffect(() => {
        if (userAuth && userAuth.uid) {
            getUser(userAuth.uid)
            router.push('/cursos')
        }
    }, [userAuth])

    const initialValues = {
        email: '',
        password: ''
    }

    const onLogin = async (values) => {
        await loginUser(values)
    }

    return (
        <>
            <Container>
                <div className={style.containerLogin}>
                    <Logo size={'15rem'}/>
                    <Formik
                        initialValues={initialValues}
                        validate={values => {
                            const errors = {};
                            if (!values.email) {
                                errors.email = <Label variant='error'>Correo electrónico es requerido</Label>;
                            } else if (
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                            ) {
                                errors.email = <Label variant='error'>Correo electrónico no válido</Label>;
                            }
                            if (!values.password) {
                                errors.password = <Label variant='error'>Contraseña es requerida</Label>;
                            }
                            return errors;
                        }}
                        onSubmit={onLogin}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting,
                          }) => (
                            <form onSubmit={handleSubmit}>
                                {userAuthError && <Alert variant='error'>Credenciales no válidas</Alert>}
                                <Label>Correo electrónico</Label>
                                <InputText type="email"
                                           name="email"
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           value={values.email}/>
                                {errors.email && touched.email && errors.email}
                                <Label>Contraseña</Label>
                                <InputText type="password"
                                           name="password"
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           value={values.password}/>
                                {errors.password && touched.password && errors.password}
                                <Button type={'primary'} disabled={isSubmitting} typeButton={'submit'} text='Ingresar'/>
                            </form>
                        )}
                    </Formik>
                </div>
            </Container>
        </>
    )
}

export default withAuth(Home);