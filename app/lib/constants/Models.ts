import Hashids from 'hashids'
import { getDate } from './gun'



export const newNameSpace = (name: string, soul: string) => {
    const hashids = new Hashids()
    const key = hashids.encode(getDate())
    const value = {
        created: new Date().toString(),
        type: 'tag',
        status: 'active',
        name: name,
        hash: soul
        // time: typeof time === 'string' && time.length > 0 ? parseInt(time) : time
    }
    return [key, value]
}

export const editedNameSpace = (tag: any[], updates: any) => {
    let update = tag
    update[1] = Object.assign(tag[1], updates)
    update[1].edited = getDate()
    return update
}