type JWTHeader = {
    alg: string,
    typ: string
}

type JwtPayload = {
    uid: number,
    jti: number,
    iat: Date,
    exp: Date,
    iss: string,
}

type JwtPair = { 
    refreshToken: string, 
    accessToken: string
}

export { JWTHeader, JwtPair, JwtPayload }