export const ApplicationName = 'Fuyuki';

export const QueryParameterNames = {
  Message: 'message',
  ReturnUrl: 'returnUrl'
};

export const LogoutActions = {
  LoggedOut: 'logged-out',
  Logout: 'logout',
  LogoutCallback: 'logout-callback'
};

export const LoginActions = {
  Login: 'login',
  LoginCallback: 'login-callback',
  LoginFailed: 'login-failed',
  Profile: 'profile',
  Register: 'register'
};

const prefix = '/authentication';

export const ApplicationPaths = {
  ApiAuthorisationClientConfigurationUrl: `/_configuration/${ApplicationName}`,
  ApiAuthorisationPrefix: prefix,
  DefaultLoginRedirectPath: '/',
  IdentityManagePath: '/Identity/Account/Manage',
  IdentityRegisterPath: '/Identity/Account/Register',
  LogOut: `${prefix}/${LogoutActions.Logout}`,
  LogOutCallback: `${prefix}/${LogoutActions.LogoutCallback}`,
  LoggedOut: `${prefix}/${LogoutActions.LoggedOut}`,
  Login: `${prefix}/${LoginActions.Login}`,
  LoginCallback: `${prefix}/${LoginActions.LoginCallback}`,
  LoginFailed: `${prefix}/${LoginActions.LoginFailed}`,
  Profile: `${prefix}/${LoginActions.Profile}`,
  Register: `${prefix}/${LoginActions.Register}`
};
