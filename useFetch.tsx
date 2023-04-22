// React Fetch Hook v1.2
// https://github.com/JulianStoev/ReactFetchHook

import { useCallback } from "react";

type fetchMethod = 'POST' | 'PUT' | 'GET' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'DELETE';

interface fetchRequest {
    urlencoded?: boolean; // used for file uploads and formData, defaults to json
    data?: {[name: string]: any | string}; // data object to be send to the backend
    errors?: boolean; // pass true if you want to consume the fetch errors where you are calling it
    uri: string;
}

export interface ajaxErrorResponse<bodyType> {
    status: number;
    statusText: string;
    body: bodyType;
}

export function useFetch() {

    const go = useCallback((data: fetchRequest, method: fetchMethod): Promise<any> => {
        
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

        return new Promise(async (resolve, reject) => {
            try {
                await fetch(data.uri, data['toSend'])
                    .then(response => response.ok ? response.text() : Promise.reject(response))
                    .then(response => {
                        // convert the response to text first to avoid error in case of no response when parsing directly to json
                        const json = (response ? JSON.parse(response) : {});
                        resolve(json);
                        return json;
                    });
            } catch(err) {
                if (data.errors === false) {
                    console.error('[Fetch error]', err);
                } else {
                    const response = {
                        status: 0,
                        statusText: '',
                        body: err
                    };

                    if (err instanceof Response) {
                        let body = await err.text();
                        try {
                            // safely check if valid json
                            body = JSON.parse(body);
                        } catch {}
                      
                        response.status = err.status;
                        response.statusText = err.statusText;
                        response.body = body;
                    }

                    reject(response);
                }
            }
        });
    }, [ generateRandomString ]);

    const post      = useCallback((data: fetchRequest) => go(data, 'POST'), [go]);
    const put       = useCallback((data: fetchRequest) => go(data, 'PUT'), [go]);
    const get       = useCallback((data: fetchRequest) => go(data, 'GET'), [go]);
    const patch     = useCallback((data: fetchRequest) => go(data, 'PATCH'), [go]);
    const head      = useCallback((data: fetchRequest) => go(data, 'HEAD'), [go]);
    const options   = useCallback((data: fetchRequest) => go(data, 'OPTIONS'), [go]);
    const del       = useCallback((data: fetchRequest) => go(data, 'DELETE'), [go]);

    return {
        post,
        put,
        get,
        patch,
        head,
        options,
        del
    }

}
