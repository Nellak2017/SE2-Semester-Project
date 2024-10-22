import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/index'
export const setupStore = (preloadedState = {}) => configureStore({ reducer: rootReducer, preloadedState })
export default configureStore({ reducer: rootReducer, })