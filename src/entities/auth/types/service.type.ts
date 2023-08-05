type LogUserData = {
    login?: string, 
    email?: string
};


type UserData = {
    domain: string,
    service: string,
    id: number,
    login: string,
    roleId?: number,
    email?: string,
    phone?: string,
};


type DigitImprint = {
    location: string,
    userAgent: string
};

export { LogUserData, UserData, DigitImprint };