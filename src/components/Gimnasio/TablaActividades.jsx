import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate, Link } from 'react-router-dom'
import ActividadesApi from '../../Services/ActividadesApi'
import Loader from '../others/Loader'
import MoreIcon from '@mui/icons-material/More';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  {
    id: 'id',
    numeric: true,
    disablePadding: true,
    label: 'Id'
  },
  {
    id: 'fecha',
    numeric: false,
    disablePadding: false,
    label: 'Fecha'
  },
  {
    id: 'hora_inicio',
    numeric: false,
    disablePadding: false,
    label: 'Hora de inicio'
  },
  {
    id: 'hora_fin',
    numeric: false,
    disablePadding: false,
    label: 'Hora de Fin'
  },
  {
    id: 'cupo',
    numeric: true,
    disablePadding: false,
    label: 'Cupos'
  },
  {
    id: 'Clientes_Inscritos',
    numeric: true,
    disablePadding: false,
    label: 'Clientes Inscritos'
  }
]

function TableMoviesHead(props) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Tooltip title='Nuevo'>
            <IconButton component={Link} to='/Actividades/Crear'>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ fontWeight: 'bold', fontSize: '1rem' }} // Estilos adicionales
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

TableMoviesHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
}

function TableMoviesToolbar(props) {
  const { numSelected } = props
  const { idSelected } = props
  const update = () => {}

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            )
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} seleccionada
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Actividades
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title='Borrar'>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Actualizar'>
            <IconButton component='a' href={`Actividades/Actualizar/${idSelected}`}>
              <EditIcon key={idSelected} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Ver Info'>
            <IconButton component='a' href={`DetalleActividades/${idSelected}`}>
              <MoreIcon key={idSelected} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title='Filtrar'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

TableMoviesToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  idSelected: PropTypes.number.isRequired
}

export default function TablaActividades() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [searchId, setSearchId] = useState('')

  useEffect(() => {
    ActividadesApi.getActividades()
      .then((response) => {
        console.log(response.data.results[0])
        setData(response.data.results)
        setError(response.error)
        setLoaded(true)
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error)
         throw new Error("Respuesta no válida del servidor")
        }
      })
  }, [])

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('id')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

  const numericTypes = ['id', 'cupo', 'Clientes_Inscritos']

  const renderTableCell = (row, cell) => {
    const { id, numeric, label } = cell
    const value = row[id]
    const isNumeric = numericTypes.includes(id)

    return (
      <TableCell
        key={id}
        align={isNumeric ? 'right' : 'left'}
        style={{ fontSize: '0.9rem' }} // Estilos adicionales
      >
        {isNumeric ? Number(value) : value}
      </TableCell>
    )
  }

  const handleSearchChange = (event) => {
    setSearchId(event.target.value)
  }

  const filteredData = searchId
    ? data.filter((item) => item.id.toString().includes(searchId))
    : data

  return (
    <>
      {!loaded && <Loader />}
      {data && data.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <TableMoviesToolbar
              numSelected={selected.length}
              idSelected={Number(selected[0]) || 0}
            />
            <Toolbar>
              <Typography variant="h6" component="div">
                Buscar por ID:
              </Typography>
              <input type="text" value={searchId} onChange={handleSearchChange} style={{ marginLeft: '1rem' }} /> {/* Estilos adicionales */}
            </Toolbar>
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
                      const isItemSelected = isSelected(row.id)
                      const labelId = `enhanced-table-checkbox-${index}`

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role='checkbox'
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox
                              color='primary'
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId
                              }}
                            />
                          </TableCell>
                          {headCells.map((cell) =>
                            renderTableCell(row, cell)
                          )}
                        </TableRow>
                      )
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={headCells.length + 1} />
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
      )}
    </>
  )
}
