// General Business Rules and Functions
import { getNestedState, dictMap } from '../../utils/helpers.js'
export const validateService = dispatch => (service, validator, defaultValue) => param => dispatch(service(validator(param) ? param : defaultValue))
export const selectState = (key, validator, defaultValue) => state => validator(getNestedState(state, key)) ? getNestedState(state, key) : defaultValue
export const aggregateServices = dispatch => (services, validators, defaults) => Object.keys(services).reduce((acc, serviceName) => ({ ...acc, [serviceName]: validateService(dispatch)(services[serviceName], validators[serviceName], defaults[serviceName]) }), {})
export const aggregateState = useSelector => (key, validators, defaults) => dictMap(Object.fromEntries(Object.entries(key).map(([key, path]) => [key, selectState(path, validators[key], defaults[key])])), useSelector)