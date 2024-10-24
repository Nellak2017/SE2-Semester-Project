export const result = (ok, error) => ({ ok, error }) // (ok, error) => <Result>{ ok, error }
export const ok = value => result(value, '') // value => { ok: value, error: '' }
export const err = error => result('', error) // error => { ok: '', error: error }
export const isOk = res => res.error === ''
export const getValue = res => res.ok
export const getError = res => res.error
export const map = (res, fn) => isOk(res) ? ok(fn(getValue(res))) : res
export const flatMap = (res, fn) => isOk(res) ? fn(getValue(res)) : res
export const apply = (res, fn) => fn(getValue(res))
export const handle = (res, successFn, falureFn) => isOk(res) ? successFn(getValue(res)) : falureFn(getError(res))
export const tryCatchSync = (fn, errFn = e => e) => { // sync fn => <Result>
	try { return ok(fn()) } catch (e) { return err(errFn(e)) }
}
export const tryCatchAsync = async (fn, errFn = e => e) => { // async fn => <Result>
	try {
		const res = await fn()
		return ok(res)
	} catch (e) {
		return err(errFn(e))
	}
}
export const tryCatchAsyncPlain = async (okFn, errFn = e => e) => { // async fn => plain
	try {
		const res = await okFn()
		return res
	} catch (e) {
		return errFn(e)
	}
}