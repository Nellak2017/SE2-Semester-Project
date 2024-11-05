import { isSchemaValid } from "../../utils/schemaHelpers"
// --- Helpers
export const dictMap = (dict, fx) => Object.fromEntries(Object.entries(dict).map(([key, value]) => [key, fx(value)]))
export const getNestedState = (state, path) => path.split('.').reduce((acc, key) => acc && typeof acc === 'object' ? acc[key] : undefined, state)
export const toValidators = (originalSchema, isSchemaValidOg = isSchemaValid) => dictMap(originalSchema, schema => data => isSchemaValidOg(data, schema))
// --- Getter/Setter validation and aggregation general functions
export const validateService = dispatch => (service, validator, defaultValue) => param => dispatch(service(validator(param) ? param : defaultValue))
export const selectState = (key, validator, defaultValue) => state => validator(getNestedState(state, key)) ? getNestedState(state, key) : defaultValue
export const aggregateServices = dispatch => (services, validators, defaults) => Object.keys(services).reduce((acc, serviceName) => ({ ...acc, [serviceName]: validateService(dispatch)(services[serviceName], validators[serviceName], defaults[serviceName]) }), {})
export const aggregateState = useSelector => (key, validators, defaults) => dictMap(Object.fromEntries(Object.entries(key).map(([key, path]) => [key, selectState(path, validators[key], defaults[key])])), useSelector)