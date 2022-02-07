import { combineReducers } from 'redux'
import spacecraft from './spacecraft-reducer'
import astronaut from './astronaut-reducer'

export default combineReducers({
  spacecraft, astronaut
})