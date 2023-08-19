import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import PlanesApi from '../../Services/PlanesApi';
import TextField from '@mui/material/TextField'; // Added for filtering
import Loader from '../others/Loader'
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Id',
  },
  {
    id: 'nombre_cliente',
    numeric: false,
    disablePadding: false,
    label: 'Cliente',
  },
  {
    id: 'nombre_plan',
    numeric: false,
    disablePadding: false,
    label: 'Plan',
  },
  {
    id: 'fecha_vigencia',
    numeric: false,
    disablePadding: false,
    label: 'vence',
  },
  {
    id: 'estado_Plan',
    numeric: false,
    disablePadding: false,
    label: 'Estado',
  },
  {
    id: 'monto',
    numeric: false,
    disablePadding: false,
    label: 'Costo',
  },
];

function TableMoviesHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableMoviesHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function TablaPagos() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    PlanesApi.obtenerHistorialPlanes()
      .then((response) => {
        console.log(response);
        setData(response.data.results);
        setFilteredData(response.data.results);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleFilter = () => {
    const filteredResults = data.filter((item) => {
      return (
        item.id.toString().includes(filterValue) ||
        item.nombre_cliente.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.nombre_plan.toLowerCase().includes(filterValue.toLowerCase())
      );
    });
    setFilteredData(filteredResults);
  };

  const clearFilter = () => {
    setFilterValue('');
    setFilteredData(data);
  };

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('year');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptydata = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <div>
      {!loaded && <Loader />}
      <div>
        <input
          type="text"
          placeholder="Filtrar por ID, Cliente, Plan"
          value={filterValue}
          onChange={handleFilterChange}
        />
        <button onClick={handleFilter}>Aplicar Filtro</button>
        <button onClick={clearFilter}>Limpiar Filtro</button>
      </div>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby='tableTitle'
              size={dense ? 'small' : 'medium'}
            >
              <TableMoviesHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(filteredData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
  
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell component='th' id={labelId} scope='row' padding='none'>
                          {row.id}
                        </TableCell>
                        <TableCell align='left'>{row.nombre_cliente}</TableCell>
                        <TableCell align='left'>{row.nombre_plan}</TableCell>
                        <TableCell align='left'>{row.fecha_vigencia}</TableCell>
                        <TableCell align='left'>{row.estado_Plan}</TableCell>
                        <TableCell align='left'>{row.monto}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptydata > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptydata,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component='div'
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage='Filas por página'
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count} página(s)`
            }
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label='Espaciado'
        />
      </Box>
    </div>
  );
}
