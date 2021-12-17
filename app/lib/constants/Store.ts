import { json } from 'remix'
import {gun} from './gun' 


/**
 * Add key value pair to graph
 * @param {Array} item `[key, value]`
 * 
 * @todo decouple validation
 */
export function storeItem(item: Array<any>) {
    return new Promise((resolve, reject) => {
        console.log(`Storing ${json(item)}`)
        gun.get('Items').get(item[0]).set(item[1], ack => {
            ack.err ? reject(ack.err) : resolve(item)
        })
    })
}

/**
 * removes soul from given data
 * @param {*} data 
 */
export const trimSoul = (data: { [x: string]: any } | undefined) => {
    if (!data || !data['_'] || typeof data['_'] !== 'object') return data
    delete data['_']
    return data
}

/**
 * retrieve random item from entry graph
 * @param {Array} id 
 */
export function getItem(id: any) {
    return new Promise((resolve, reject) => {
        if (!id) reject(`${id} is not here.`)
        gun.get('Items').get(id).map().once((data, key) => {
            resolve([id, trimSoul(data)])
        })
    })
}

/**
 * retrieve all items from entry graph
 * @param {Array} id 
 */
export async function getItems(id: any) {
    let results:  any[] = []
    await gun.get('Items').get(id).map().on((data, key) => {
        new Promise((resolve, reject) => {
            if (!data) reject(`${data} is not here.`)
            resolve(results.push(trimSoul(data)))
        })
    })
    return Promise.all(results)
}

/**
 * retrieve last item from entry graph
 * @param {Array} id 
 */
export async function getItemLast(id: any) {
    return new Promise(async (resolve, reject) => {
        let items = await getItems(id)
        console.log('Stored Items', items)
        let value = items[items.length - 1]
        resolve([id, value])
    })
}

/**
 * Update existing key with given value
 * @param {Array} item `[key, value]`
 */
export const updateItem = async (item: any) => await storeItem(item)

/**
 * Remove item in Gun Store
 * @param {*} key 
 */
export const removeItem = async (key: string) => {
    return new Promise((resolve, reject) => {
        gun.get('Items').get(key).set(() => null, (ack) => {
            if (ack.err) reject(ack.err)
            else resolve(key)
        })
    })
}

/**
 * Get all Keys from Gun Store
 * @param {boolean} [validator] (key, value) critera for each item to pass
 */
export const getKeys = async () => {
    const keys:  any[] = []
    await gun.get('Items').map().on((value, key) => {
        new Promise(async (resolve, reject) => {
            if (!key) reject(null)
            resolve(keys.push(key))
        })
    })
    return Promise.all(keys)
}

/**
 * Get all current Items from Gun Store
 */
export const multiGet = async () => {
    let keys = await getKeys()
    if (!Array.isArray(keys)) return ({error: 'invalid keys'})
    let results = keys.map(key => getItem(key))
    return Promise.all(results)
}

/**
 * Get all Items from Gun Store, including immutable sets
 */
export const multiGetAll = () => {
    return new Promise(async (resolve, reject) => {
        let results:Array<any> = []
        let keys = await getKeys()
        if (!Array.isArray(keys)) reject('invalid keys')
        await keys.map(async key => {
            let items = await getItems(key)
            console.log('Items', key, items)
            results.push([key, items])
        })
        resolve(results)
    })
}

/**
 * Run validator against result
 * @param {*} result 
 * @param {*} validator
 * @todo check for bad validator
 * @todo could run this within gun.map() filter 
 */
export const storeMap = (result: any[], validator: (arg0: any) => boolean) => {
    let key = result[0]
    let value = result[1]
    if (!key || key === 'undefined') return false
    if (!value || value === 'undefined') return false
    // if (typeof value === 'string' && value.charAt(0) === '{') {
    if (typeof value === 'object') {
        // value = JSON.parse(result[1])
        if (validator(value) === true) return [key, value]
        else return false
    }
    else return false
}

// /**
//  * 
//  * @param {*} validator 
//  */
// export const getAll = (validator: any) => {
//     return new Promise(async (resolve, reject) => {
//         const stores = await multiGet()
//         if (!stores && !Array.isArray(stores)) reject('Invalid Store.')
//         let results = stores.map((result: any) => storeMap(result, validator)).filter((result: any) => result)
//         resolve(results)
//     })

// }

// /**
//  * 
//  * @param {*} validator 
//  */
// export const getAllOptimized = async (validator: (arg0: any) => any) => {
//     let results: readonly any[] = []
//     let keys = await getKeys()
//     if (!Array.isArray(keys)) return ('invalid keys')
//     await keys.map(async key => {
//         await gun.get('Items').get(key).map(item => typeof item[1] === 'object' && validator(item[1]) ? item : undefined).once((data, key) => {
//             results.push(new Promise((resolve, reject) => {
//                 if (!data) reject(key)
//                 resolve([key, trimSoul(data)])
//             }))
//         })
//     })
//     return Promise.all(results)
// }


// /**
//  * get all items that are valid, subscribe to each
//  * @param {*} validator
//  */
// export const getAllSubscribe = (validator: any) => {
//     return new Promise(async (resolve, reject) => {
//         const stores = await multiGet()
//         if (!stores && !Array.isArray(stores)) reject('Invalid Store.')
//         let results = stores.map((result: any) => storeMap(result, validator)).filter((result: any) => result)
//         resolve(results)
//     })

// }

// /**
//  * `DANGER!`
//  * Nullifies entire Item Store.
//  */
// export const removeAll = async () => {
//     let keys = await getKeys()
//     let results:  any[] = []
//     if (!Array.isArray(keys)) return ('invalid keys')
//     await keys.map(key => results.push(storeItem([key, null])))
//     return Promise.all(results)
// }