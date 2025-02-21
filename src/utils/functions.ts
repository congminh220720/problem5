'use strict'

import { Types } from 'mongoose';

const convertToObjectId = (id: string): Types.ObjectId  => new Types.ObjectId(id)

const removeUndefinedObject = (obj:any): any => {
    Object.keys(obj).forEach( k => {
        if (obj[k] == null) {
            delete obj[k]
        }
    })

    return obj
}

function isImageUrl(url: string): boolean {
    if (typeof url !== "string") return false;

    try {
        const parsedUrl = new URL(url)
        const pathname = parsedUrl.pathname
        const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
        return imageExtensions.test(pathname);
    } catch {
        return false;
    }
}


function validateEmail(email:string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
  
  

export {
    convertToObjectId,
    removeUndefinedObject,
    isImageUrl,
    validateEmail,
}