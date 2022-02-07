const INITIAL_STATE = {
  astronautList: [],
  count: 0,
  error: null,
  fetching: false,
  fetched: false
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'GET_ASTRONAUTS_PENDING':
    case 'ADD_ASTRONAUT_PENDING':
    case 'SAVE_ASTRONAUT_PENDING':
    case 'DELETE_ASTRONAUT_PENDING':
      return { ...state, error: null, fetching: true, fetched: false }
    case 'GET_ASTRONAUTS_FULFILLED':
    case 'ADD_ASTRONAUT_FULFILLED':
    case 'SAVE_ASTRONAUT_FULFILLED':
    case 'DELETE_ASTRONAUT_FULFILLED':
      return { ...state, astronautList: action.payload, error: null, fetching: false, fetched: true }
    case 'GET_ASTRONAUTS_REJECTED':
    case 'ADD_ASTRONAUT_REJECTED':
    case 'SAVE_ASTRONAUT_REJECTED':
    case 'DELETE_ASTRONAUT_REJECTED':
      return { ...state, astronautList: [], error: action.payload, fetching: false, fetched: true }
    default:
      return state
  }
}