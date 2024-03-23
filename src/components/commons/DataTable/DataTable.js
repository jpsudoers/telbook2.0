import React, {useState, useEffect} from 'react';
import {FilterMatchMode, FilterOperator} from 'primereact/api';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import style from './DataTable.module.scss';
import Button from "@/components/commons/Button/Button";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFilePdf} from '@fortawesome/free-solid-svg-icons'

const DataTableFilter = ({
                             headers,
                             search,
                             emptyMessage,
                             isExport,
                             data,
                             loading,
                             isHeader = true,
                             isScroll = false,
                             isSmall = false
                         }) => {
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    useEffect(() => {
        initFilters();
    }, []);

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        const objectSearch = search.map(field => ({
            [field]: {
                operator: FilterOperator.AND,
                constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
            },
        }));
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            ...objectSearch,
        });
        setGlobalFilterValue('');
    };

    const exportColumns = headers.map((col) => ({title: col.header, dataKey: col.field}));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                const dataToPdf = exportColumns.filter(column => {
                    return column.title !== 'Acciones'
                });
                doc.text(15, 15, "Libro de matrícula");
                doc.autoTable(dataToPdf, data, {
                        startY: 20,
                    }
                );
                doc.save('libro-matricula-reducida.pdf');
            });
        });
    }

    const renderHeader = () => {
        return (
            isHeader ? <div className={style.dataTableFilter}>
                <Button type="primary-outline" icon="pi pi-filter-slash" text="Limpiar búsqueda"
                        onClick={clearFilter}>
                </Button>
                <div>
                    <span style={{marginRight: '10px'}}>
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda"/>
                    </span>

                    {/* JPS // Se elimina botón PDF
                    isExport &&
                     //   <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faFilePdf} size={'xl'} onClick={exportPdf}/> */}
                </div>
            </div> : null
        );
    };

    const header = renderHeader();

    return (
        <DataTable
            value={data}
            header={header}
            emptyMessage={emptyMessage}
            filters={filters}
            globalFilterFields={search}
            loading={loading}
            scrollable={isScroll}
            size={isSmall ? 'small' : 'normal'}
            scrollHeight="700px"
            sortField={'n'}
            sortOrder={1}
        >
            {
                headers && headers.map((column, key) => {
                    if (column.body) {
                        return <Column key={key} style={{minWidth: column.size}}
                                       body={column.body} header={column.header}/>;
                    }
                    return <Column sortable={column.field === 'n'} colSpan={column.field === 'edit' ? 2 : 1} frozen={key === 0} key={key} style={{minWidth: column.size}}
                                   field={column.field} header={column.header}/>;
                })
            }
        </DataTable>
    );
}

export default DataTableFilter;