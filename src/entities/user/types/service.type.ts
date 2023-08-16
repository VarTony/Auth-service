type UserData = {
  domainName: string;
  service: string;
  id: number;
  login: string;
  roleId?: number;
  email?: string;
  phone?: string;
  passhash: string;
  salt: string;
};

export { UserData };
