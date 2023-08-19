import { JWTHeader, JWTPayload } from './jwt.type';

type ResultOfTokenVerification =
  | 'Ok'
  | 'Fake_Token'
  | 'Not_Found'
  | 'Token_Expired'
  | 'Atypical_Device_Data';


type DataFromJWTParser = {
    str: { header: string; payload: string; signature: string };
    map: {
      header: JWTHeader;
      payload: JWTPayload;
    };
  };

export { ResultOfTokenVerification, DataFromJWTParser };
