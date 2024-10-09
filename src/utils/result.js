// Functions to help deal with result types, hand-made
// --- Core Result type functions
export const result = (ok, error) => ({ ok, error }) // (ok, error) => <Result>{ ok, error }
export const ok = value => result(value, '') // value => { ok: value, error: '' }
export const err = error => result('', error) // error => { ok: '', error: error }
export const isOk = result => result.error === ''
export const getValue = result => result.ok
export const getError = result => result.error
export const map = (result, fn) => isOk(result) ? ok(fn(getValue(result))) : result
export const flatMap = (result, fn) => isOk(result) ? fn(getValue(result)) : result
export const apply = (result, fn) => fn(getValue(result))
export const handle = (result, successFn, falureFn) => isOk(result) ? successFn(getValue(result)) : falureFn(getError(result))

// --- Helper Result type functions
export const tryCatchSync = (fn, errFn = e => e) => { // sync fn => <Result>
	try { return ok(fn()) } catch (e) { return err(errFn(e)) }
}
export const tryCatchAsync = async (fn, errFn = e => e) => { // async fn => <Result>
	try {
		const result = await fn()
		return ok(result)
	} catch (e) {
		return err(errFn(e))
	}
}
export const tryCatchAsyncPlain = async (okFn, errFn = e => e) => { // async fn => plain
	try {
		const result = await okFn()
		return result
	} catch (e) {
		return errFn(e)
	}
}