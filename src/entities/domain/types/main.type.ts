interface DomainType {
  id: number;
  name: string;
  passhash: string;
  salt: string;
  secret: string;
  host: string;
  isActive: boolean;
  deactivatedAt?: Date;
  createdAt: Date;
};

type AddNewDomainResult = {
  result: string;
  status: number;
  partOfSecret?: string;
};


export { AddNewDomainResult, DomainType };