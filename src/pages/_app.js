import '@/styles/globals.css';
import UserState from "@/context/user/User.state";
import StudentsState from "@/context/students/Students.state";
import PlanningContext from "@/context/planning/Planning.state";
import {AuthContextProvider} from '@/context/auth/Auth.context';
import {addLocale} from "primereact/api";
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/primereact.min.css";


export default function App({Component, pageProps}) {
    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        clear: 'Limpiar'
    });

    return <AuthContextProvider>
        <PlanningContext>
            <StudentsState>
                <UserState>
                    <Component {...pageProps} />
                </UserState>
            </StudentsState>
        </PlanningContext>
    </AuthContextProvider>

}