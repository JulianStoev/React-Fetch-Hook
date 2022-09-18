// React Fetch Hook v1.1
// https://github.com/JulianStoev/ReactFetchHook

import { useCallback } from "react";

type fetchMethod = 'POST' | 'PUT' | 'GET' | 'HEAD' | 'OPTIONS' | 'DELETE';

interface fetchRequest {
  urlencoded?: boolean;
  data?: any;
  errors?: boolean;
  uri: string;
}

export function useFetch() {

  const go = useCallback((data: fetchRequest, method: fetchMethod): Promise<any> => {
    return new Promise(resolve => {
      data['toSend'] = {
        method: method,
        mode: 'cors',
        headers: new Headers({
          'Content-Type': (data.urlencoded ? 'application/x-www-form-urlencoded' : 'application/json')
        })
      };
      if (data.data) {
        (method === 'GET') ? data.uri += '?' + new URLSearchParams(data.data) : data['toSend'].body = JSON.stringify(data.data);
      }

      fetch(`${data.uri}`, data['toSend'])
        .then(response => response.ok ? response.text() : Promise.reject(response.statusText))
        .then(response => {
          const json = response ? JSON.parse(response) : {};
          resolve(json);
        })
        .catch((error: string) => console.error('[Fetch error]', error));
    });
  }, []);

  const post    = useCallback((data: fetchRequest) => go(data, 'POST'), [go]);
  const put     = useCallback((data: fetchRequest) => go(data, 'PUT'), [go]);
  const get     = useCallback((data: fetchRequest) => go(data, 'GET'), [go]);
  const head    = useCallback((data: fetchRequest) => go(data, 'HEAD'), [go]);
  const options = useCallback((data: fetchRequest) => go(data, 'OPTIONS'), [go]);
  const del     = useCallback((data: fetchRequest) => go(data, 'DELETE'), [go]);

  return {
    post,
    put,
    get,
    head,
    options,
    del
  }
  
}

