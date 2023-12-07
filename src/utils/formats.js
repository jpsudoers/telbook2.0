export const formatRun = (run) => {
    const newRut = run.replace(/\./g, '').replace(/\-/g, '').trim().toLowerCase();
    const lastDigit = newRut.substr(-1, 1);
    const rutDigit = newRut.substr(0, newRut.length - 1)
    let format = '';
    for (let i = rutDigit.length; i > 0; i--) {
        const e = rutDigit.charAt(i - 1);
        format = e.concat(format);
        if (i % 3 === 0) {
            format = '.'.concat(format);
        }
    }
    return format.concat('-').concat(lastDigit);
}

export const formatDate = (date) => {
    if (date && date.length === 8) {
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);
        return day + '-' + month + '-' + year;
    }
    return 'Fecha no válida'
}

export function unique(obj) {
    const uniques = [];
    const stringify = {};
    for (let i = 0; i < obj.length; i++) {
        const keys = Object.keys(obj[i]);
        keys.sort(function (a, b) {
            return a - b
        });
        let str = '';
        for (let j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }
    return uniques
}

export const Fn = {
    validaRut: function (rutCompleto) {
        if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
            return false;
        let tmp = rutCompleto.split('-');
        let digv = tmp[1];
        let rut = tmp[0];
        if (digv == 'K') digv = 'k';
        return (Fn.dv(rut) == digv);
    },
    dv: function (T) {
        let M = 0, S = 1;
        for (; T; T = Math.floor(T / 10))
            S = (S + T % 10 * (9 - M++ % 6)) % 11;
        return S ? S - 1 : 'k';
    }
}

export const dateToFirebase = (date) => {
    let month = '' + (date.getMonth() + 1)
    let day = '' + date.getDate()
    let year = date.getFullYear()

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('');
}

export const dateToFirebaseWithSlash = (date) => {
    let month = '' + (date.getMonth() + 1)
    let day = '' + date.getDate()
    let year = date.getFullYear()

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export const capitalize = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
;