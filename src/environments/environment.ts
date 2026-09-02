interface RuntimeEnvironment {
  API_URL?: string;
}

const runtimeEnvironment = (window as Window & { __env?: RuntimeEnvironment }).__env;

export const environment = {
  production: true,
  baseUrl: runtimeEnvironment?.API_URL ?? 'https://english-forever-api.onrender.com'
};
