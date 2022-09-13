export const prefixUrlWithTokenAuth = (
  {url, username, token}: {
    url: string,
    username: string
    token: string
  }) => {
  return url.replace("https://", `https://${username}:${token}@`);
};