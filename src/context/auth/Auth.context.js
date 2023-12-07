import React from 'react';
import {onAuthStateChanged,} from 'firebase/auth';
import {auth} from '@/firebase_setup/firebase';
import Container from "@/components/commons/Container/Container";
import Loading from "@/components/commons/Loading/Loading";
import {useRouter} from "next/router";

export const AuthContext = React.createContext({});
export const useAuthContext = () => React.useContext(AuthContext);
export const AuthContextProvider = ({children}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const EmptyLayout = () => {
        return <>
            <Container>
                <Loading/>
            </Container>
        </>
    }

    return (
        <AuthContext.Provider value={{userAuth: user}}>
            {loading ? <EmptyLayout/> : children}
        </AuthContext.Provider>
    );
};