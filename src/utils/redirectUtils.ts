export const setRedirectRoute = (route: string) => {
  sessionStorage.setItem('redirectRoute', route);
};

export const getAndClearRedirectRoute = () => {
  const route = sessionStorage.getItem('redirectRoute');
  sessionStorage.removeItem('redirectRoute');
  return route;
};
