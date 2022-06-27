import { PeopleOutline } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { NextPage } from 'next/types'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { tesloApi } from '../../api'
import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces'

const UsersPage: NextPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users')
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (data) {
      setUsers(data)
    }
  }, [data])

  if (!data && !error) return <></>

  // * Actualiza el rol de un usuario
  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previosUsers = users.map((user) => ({ ...user }))
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }))

    setUsers(updatedUsers)

    try {
      await tesloApi.put('/admin/users', { userId, role: newRole })
    } catch (error) {
      setUsers(previosUsers)
      console.log(error)
      alert('No se pudo actualizar el role del usuario')
    }
  }

  // GRID DATA
  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    // { field: 'role', headerName: 'Rol', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label='Rol'
            onChange={({ target }) => onRoleUpdated(row.id, target.value)}
            sx={{ width: '300px' }}
          >
            <MenuItem value='admin'> Admin </MenuItem>
            <MenuItem value='client'> Client </MenuItem>
            <MenuItem value='super-user'> Super User </MenuItem>
            <MenuItem value='SEO'> SEO </MenuItem>
          </Select>
        )
      },
    },
  ]

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }))

  return (
    <AdminLayout
      title='Usuarios'
      subTitle='Mateniendo de usuarios'
      icon={<PeopleOutline />}
    >
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}
export default UsersPage
