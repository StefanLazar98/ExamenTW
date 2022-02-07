import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'

import { getAstronauts, addAstronaut, saveAstronaut, deleteAstronaut } from '../actions'
import useFetch from './useFetch';

const astronautSelector = state => state.astronaut.astronautList

const AstronautList = () => {

  const [isDialogShown, setIsDialogShown] = useState(false)
  const [nume, setNume] = useState('')
  const [rol, setRol] = useState('')

  const [isNewRecord, setIsNewRecord] = useState(true)
  const [selectedAstronaut, setSelectedAstronaut] = useState(null)

  let astronauts = useSelector(astronautSelector)

  if (astronauts === undefined) {
    astronauts = []
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAstronauts(id))
  }, [])


  const handleAddClick = (evt) => {
    setIsDialogShown(true)
    setIsNewRecord(true)
    setNume('')
    setRol('')
  }

  const hideDialog = () => {
    setIsDialogShown(false)
  }

  const handleSaveClick = () => {
    if (isNewRecord) {
      dispatch(addAstronaut(id, { nume, rol }))
    } else {
      dispatch(saveAstronaut(id, selectedAstronaut, { nume, rol }))
    }
    setIsDialogShown(false)
    setSelectedAstronaut(null)
    setNume('')
    setRol('')
  }

  const editAstronaut = (rowData) => {
    setSelectedAstronaut(rowData.id)
    setNume(rowData.nume)
    setRol(rowData.rol)
    setIsDialogShown(true)
    setIsNewRecord(false)
  }

  const handleDeleteAstronaut = (rowData) => {
    dispatch(deleteAstronaut(rowData.id))
  }

  const tableFooter = (
    <div>
      <Button label='Add astronaut' icon='pi pi-plus' onClick={handleAddClick} />
    </div>
  )

  const dialogFooter = (
    <div>
      <Button label='Save astronaut' icon='pi pi-save' onClick={handleSaveClick} />
    </div>
  )

  const opsColumn = (rowData) => {
    return (
      <div>
        <Button label='Edit' icon='pi pi-pencil' onClick={() => editAstronaut(rowData)} />
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteAstronaut(rowData)} />
      </div>
    )
  }

  const { id } = useParams();
  const { data: spacecraft, error, isPending } = useFetch(`http://localhost:8080/spacecrafts/${id}`)

  console.log('astronaut received spacecraft id' + id);
  const navigate = useNavigate();
  return (
    <>
      <div>
        {isPending && <div> Loading...</div>}
        {error && <div>{error}</div>}
        {spacecraft && (
          <article>
            <h2>Spacecraft: {spacecraft.nume}</h2>
          </article>
        )}
      </div>
      <DataTable value={astronauts} footer={tableFooter}>
        <Column header='Nume' field='nume' />
        <Column header='Rol' field='rol' />
        <Column header='Options' body={opsColumn} />
      </DataTable>

      <Dialog header='A New Astronaut' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
        <div>
          <InputText placeholder='Astronaut nume' onChange={(evt) => setNume(evt.target.value)} value={nume} />
        </div>
        <div>
          <InputText placeholder='Astronaut rol' onChange={(evt) => setRol(evt.target.value)} value={rol} />
        </div>
      </Dialog>

      <Button label='Back' onClick={() => navigate(-1)} />
    </>
  )
}

export default AstronautList;