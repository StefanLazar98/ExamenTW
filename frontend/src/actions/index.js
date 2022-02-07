import { SERVER } from '../config/global'

export const getSpacecrafts = (filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'GET_SPACECRAFTS',
    payload: async () => {
      const response = await fetch(`${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&limit=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const getAstronauts = (spacecraftId) => {
  return {
    type: 'GET_ASTRONAUTS',
    payload: async () => {
      const response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts`)
      const data = await response.json()
      return data
    }
  }
}

export const addSpacecraft = (spacecraft, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'ADD_SPACECRAFT',
    payload: async () => {
      let response = await fetch(`${SERVER}/spacecrafts`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(spacecraft)
      })
      response = await fetch(`${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&limit=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const addAstronaut = (spacecraftId, astronaut) => {
  return {
    type: 'ADD_ASTRONAUT',
    payload: async () => {
      let response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(astronaut)
      })
      response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts`)
      const data = await response.json()
      return data
    }
  }
}

export const saveSpacecraft = (id, spacecraft, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'SAVE_SPACECRAFT',
    payload: async () => {
      let response = await fetch(`${SERVER}/spacecrafts/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(spacecraft)
      })
      response = await fetch(`${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&limit=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const saveAstronaut = (spacecraftId, astronautId, astronaut) => {
  return {
    type: 'SAVE_ASTRONAUT',
    payload: async () => {
      let response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts/${astronautId}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(astronaut)
      })
      response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteSpacecraft = (spacecraftId) => {
  return {
    type: 'DELETE_SPACECRAFT',
    payload: async () => {
      let response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/spacecrafts`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteAstronaut = (spacecraftId, astronautId) => {
  return {
    type: 'DELETE_ASTRONAUT',
    payload: async () => {
      let response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts/${astronautId}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/spacecrafts/${spacecraftId}/astronauts`)
      const data = await response.json()
      return data
    }
  }
}