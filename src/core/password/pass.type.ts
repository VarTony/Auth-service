type PassPack = {
  passhash: string;
  salt: string;
};

type PassData = PassPack & {
  password: string;
};

export { PassPack, PassData };
