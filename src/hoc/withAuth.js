import {useEffect} from "react";
import {useRouter} from 'next/router'
import {useAuthContext} from "@/context/auth/Auth.context";

const withAuth = (Component) => {
    // eslint-disable-next-line react/display-name
    return () => {
        const router = useRouter()
        const {user} = useAuthContext()

        useEffect(() => {
            // if(Object.keys(user).length > 0 && Component.name === 'Home') {
            //     router.push("/cursos")
            // }
            if (user === null) router.push("/")
        }, [router, user])
        return (<Component/>);
    };
};

export default withAuth;