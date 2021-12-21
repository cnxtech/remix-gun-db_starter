import 'gun/sea'
import Gun from "gun";
let sea = Gun.SEA
export const getHash = async (
    data: any,
    salt: string
) => {
    const message = await sea.work(data, salt, null, {
        name: 'SHA-256' ,
        encode: 'base32',
        length: 9
    });
    return message.slice(0, 9);
};