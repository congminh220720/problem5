'use strict'

// REGEX 
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const MAX_LENGTH_NAME = 150

// USER
export const MAX_LOGIN_INCORRECT = 5

// // API KEY
export const FULL_PER = '0000'
export const WRITE_PER = '1111'
export const DELETE_PER = '0000'

export const PERMISSIONS = [
    FULL_PER,
    WRITE_PER,
    DELETE_PER
]

// AUTH 
export const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

