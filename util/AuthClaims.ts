type AuthClaims = {
  authenticated: boolean;
  uid?: string | undefined;
  email?: string | undefined;
};

export default AuthClaims;