type ResultOfTokenVerification =
  | 'Ok'
  | 'Fake_Token'
  | 'Not_Found'
  | 'Token_Expired'
  | 'Atypical_Device_Data';

export { ResultOfTokenVerification };
