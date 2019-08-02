import request from 'request-promise';

export function createHttpClient(baseUrl: string) {
  return request.defaults({
    baseUrl,
    json: true,
  });
}
