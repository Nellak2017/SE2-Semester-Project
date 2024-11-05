import { tryCatchSync, isOk } from './result'
import * as Yup from 'yup'
export const isSchemaValid = (data, schema) => isOk(tryCatchSync(() => schema.validateSync(data, { abortEarly: false, strict: true })), console.error)
export const any = Yup.mixed().required(), number = Yup.number().required(), mixedArray = Yup.array().of(Yup.mixed()).required(), bool = Yup.boolean().required(), string = Yup.string().required(), mixed = Yup.mixed().required(), object = obj => Yup.object(obj)