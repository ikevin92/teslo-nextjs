import { ShopLayout } from '../../components/layouts/ShopLayout'
import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import NextLink from 'next/link'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra información si esta pagada la orden o no',
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip color='success' label='Pagada' variant='outlined' />
      ) : (
        <Chip color='error' label='No pagada' variant='outlined' />
      )
    },
  },
  {
    field: 'order',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline='always'>Ver orden</Link>
        </NextLink>
      )
    },
  },
]

const rows = [
  { id: 1, paid: true, fullname: 'Juan Perez' },
  { id: 2, paid: false, fullname: 'Kevin Price' },
  { id: 3, paid: true, fullname: 'Aldo Mata' },
  { id: 4, paid: false, fullname: 'Luis Dias' },
  { id: 5, paid: true, fullname: 'Mohamed Mane' },
]

const HisrotyPage = () => {
  return (
    <ShopLayout
      title='Historial de Ordenes'
      pageDescription='Historial de Ordenes del cliente'
    >
      <Typography variant='h1' component='h1'>
        Historial de Ordenes
      </Typography>

      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}
export default HisrotyPage
