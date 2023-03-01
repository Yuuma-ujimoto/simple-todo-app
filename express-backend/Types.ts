export type DefaultResponse={
    ServerError:boolean,
    ClientError:boolean,
    ErrorMessage?:string
}


export type AuthTokenResult = {
    success:boolean,
    userId?:string
}

