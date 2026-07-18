// demo auth — swap for real API calls later
export const TOKEN_COOKIE = "obsly_token";

// routes reachable without a token
export const AUTH_ROUTES = ["/login", "/signup", "/forgot", "/reset", "/otp"];

// store a token client-side so the middleware guard lets the user in
export function setToken(token = "demo") {
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=604800`;
}

// clear the token on logout
export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}
