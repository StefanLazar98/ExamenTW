const INITIAL_STATE = {
  spacecraftList: [],
  count: 0,
  error: null,
  fetching: false,
  fetched: false
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'GET_SPACECRAFTS_PENDING':
    case 'ADD_SPACECRAFT_PENDING':
    case 'SAVE_SPACECRAFT_PENDING':
    case 'DELETE_SPACECRAFT_PENDING':
      return { ...state, error: null, fetching: true, fetched: false }
    case 'GET_SPACECRAFTS_FULFILLED':
    case 'ADD_SPACECRAFT_FULFILLED':
    case 'SAVE_SPACECRAFT_FULFILLED':
    case 'DELETE_SPACECRAFT_FULFILLED':
      return { ...state, spacecraftList: action.payload.records, count: action.payload.numberOfSpacecrafts, error: null, fetching: false, fetched: true }
    case 'GET_SPACECRAFTS_REJECTED':
    case 'ADD_SPACECRAFT_REJECTED':
    case 'SAVE_SPACECRAFT_REJECTED':
    case 'DELETE_SPACECRAFT_REJECTED':
      return { ...state, spacecraftList: [], error: action.payload, fetching: false, fetched: true }
    default:
      return state
  }
}