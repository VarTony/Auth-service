type JWTHeader = {
    alg: string,
    typ: string
}

type JwtPayload = {
    roles?: string
}

export { JWTHeader }