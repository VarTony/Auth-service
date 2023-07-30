type logUserData = {
    login?: string, 
    email?: string
};

type passData = {
    password: string,
    passhash: string,
    salt: string
}

export { logUserData, passData };