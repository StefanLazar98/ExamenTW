import './style.css';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useNavigate } from 'react-router-dom';

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'

import { getSpacecrafts, addSpacecraft, saveSpacecraft, deleteSpacecraft } from '../actions'

const spacecraftSelector = state => state.spacecraft.spacecraftList
const spacecraftCountSelector = state => state.spacecraft.count

function SpacecraftList() {

  const navigate = useNavigate();

  const [isDialogShown, setIsDialogShown] = useState(false)
  const [nume, setNume] = useState('')
  const [vitezaMaxima, setvitezaMaxima] = useState(0)
  const [masa, setmasa] = useState(0)
  const [isNewRecord, setIsNewRecord] = useState(true)
  const [selectedSpacecraft, setSelectedSpacecraft] = useState(null)
  const [filterString, setFilterString] = useState('')
  const [filters, setFilters] = useState({
    nume: { value: null, matchMode: FilterMatchMode.CONTAINS },
    vitezaMaxima: { value: null, matchMode: FilterMatchMode.CONTAINS },
    masa: { value: null, matchMode: FilterMatchMode.CONTAINS }
  })
  const [page, setPage] = useState(0)
  const [first, setFirst] = useState(0)
  const [sortField, setSortFiels] = useState('')
  const [sortOrder, setSortOrder] = useState(1)

  const handleSort = (evt) => {
    setSortFiels(evt.sortField)
    setSortOrder(evt.sortOrder)
  }

  const handleFilter = (evt) => {
    const oldFilters = filters
    oldFilters[evt.field] = evt.constraints.constraints[0]
    setFilters({ ...oldFilters })
  }

  const handleFilterClear = (evt) => {
    setFilters({
      nume: { value: null, matchMode: FilterMatchMode.CONTAINS },
      vitezaMaxima: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })
  }

  useEffect(() => {
    const keys = Object.keys(filters)
    const computedFilterString = keys.map(e => {
      return {
        key: e,
        value: filters[e].value
      }
    }).filter(e => e.value).map(e => `${e.key}=${e.value}`).join('&')
    setFilterString(computedFilterString)
  }, [filters])

  let spacecrafts = useSelector(spacecraftSelector)
  const count = useSelector(spacecraftCountSelector)

  if (spacecrafts === undefined) {
    spacecrafts = []
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSpacecrafts(filterString, page, 4, sortField, sortOrder))
  }, [filterString, page, sortField, sortOrder])

  useEffect(() => {
    const data = [['nume', 'vitezaMaxima', 'masa']]
    for (const spacecraft of spacecrafts) { data.push([spacecraft.nume, spacecraft.vitezaMaxima, spacecraft.masa]) }
  }, [spacecrafts])

  const handleAddClick = (evt) => {
    setIsDialogShown(true)
    setIsNewRecord(true)
    setNume('')
    setvitezaMaxima(0)
    setmasa(0)
  }

  const hideDialog = () => {
    setIsDialogShown(false)
  }

  const handleSaveClick = () => {
    if (isNewRecord) {
      dispatch(addSpacecraft({ nume, vitezaMaxima, masa }))
    } else {
      dispatch(saveSpacecraft(selectedSpacecraft, { nume, vitezaMaxima, masa }))
    }
    setIsDialogShown(false)
    setSelectedSpacecraft(null)
    setNume('')
    setvitezaMaxima(0)
    setmasa(0)
  }

  const editSpacecraft = (rowData) => {
    setSelectedSpacecraft(rowData.id)
    setNume(rowData.nume)
    setvitezaMaxima(rowData.vitezaMaxima)
    setmasa(rowData.masa)
    setIsDialogShown(true)
    setIsNewRecord(false)
  }

  const navSpacecraft = (rowData) => {
    setSelectedSpacecraft(rowData.id)
    navigate("/spacecrafts/" + rowData.id)
    console.log("/spacecrafts/" + rowData.id)
  }

  const handleDeleteSpacecraft = (rowData) => {
    dispatch(deleteSpacecraft(rowData.id))
  }

  const tableFooter = (
    <div>
      <Button label='Add' icon='pi pi-plus' onClick={handleAddClick} />
    </div>
  )

  const dialogFooter = (
    <div>
      <Button label='Save' icon='pi pi-save' onClick={handleSaveClick} />
    </div>
  )

  const opsColumn = (rowData) => {
    return (
      <div>
        <Button label='Edit' icon='pi pi-pencil' onClick={() => editSpacecraft(rowData)} />
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteSpacecraft(rowData)} />
        <Button label='Astronauts' onClick={() => navSpacecraft(rowData)} />
      </div>
    )
  }

  const handlePageChange = (evt) => {
    setPage(evt.page)
    setFirst(evt.page * 4)
  }

  return (
    <div>
      <div class="components">
        <DataTable value={spacecrafts} footer={tableFooter}
          lazy
          paginator onPage={handlePageChange}
          first={first}
          rows={4}
          totalRecords={count}
          onSort={handleSort} sortField={sortField} sortOrder={sortOrder}
        >
          <Column xs={12} sm={3} md={2} lg={1} header='Nume' field='nume' filter filterField='nume' filterPlaceholder='filter by nume' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
          <Column header='Viteza Maxima' field='vitezaMaxima' filter filterField='vitezaMaxima' filterPlaceholder='filter by vitezaMaxima' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
          <Column header='Masa' field='masa' />
          <Column header='Options' body={opsColumn} />
        </DataTable>
      </div>

      <Dialog header='A spacecraft' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
        <div>
          <InputText placeholder='nume' onChange={(evt) => setNume(evt.target.value)} value={nume} />
        </div>
        <div>
          <InputText placeholder='vitezaMaxima' onChange={(evt) => setvitezaMaxima(evt.target.value)} value={vitezaMaxima} />
        </div>
        <div>
          <InputText placeholder='masa' onChange={(evt) => setmasa(evt.target.value)} value={masa} />
        </div>
      </Dialog>
    </div>
  )
}

export default SpacecraftList