import axios, { AxiosResponse } from 'axios';

export class BaseService {
  #removeEmpty = <T>(obj: T): unknown =>
    Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v != null && typeof v !== 'undefined' && v !== '')
        .map(([k, v]) =>
          typeof v === 'object' ? [k, this.#removeEmpty(v)] : [k, v]
        )
    );

  protected getData = <T>(url: string, params?: unknown): Promise<T> =>
    axios
      .get(url, {
        params:
          typeof params !== 'undefined' ? this.#removeEmpty(params) : undefined,
      })
      .then((result: AxiosResponse<T>) => result.data);

  protected postData = <T>(url: string, body: unknown): Promise<T> =>
    axios.post(url, body, {}).then((result: AxiosResponse<T>) => result.data);

  protected putData = <T>(url: string, body?: unknown): Promise<T> =>
    axios.put(url, body, {}).then((result: AxiosResponse<T>) => result.data);

  protected deleteData = <T>(url: string): Promise<T> =>
    axios.delete(url, {}).then((result: AxiosResponse<T>) => result.data);
}
