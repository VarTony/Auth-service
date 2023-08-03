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


export { LogUserData, UserData };