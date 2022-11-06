import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { Credentials, Filters, LoginInfo, LogoutInfo, ObjectInformation, UserFile, UserInfo } from '@src/models';

interface ApiError {
  error: boolean;
  message: string;
}

const api = axios.create({
  baseURL: 'http://185.221.152.242:5500/api',
  headers: { 'Content-Type': 'application/json' },
});

function deleteHeader(key: string) {
  delete api.defaults.headers.common[key];
}

function setHeader(key: string, value: string) {
  if (api.defaults.headers.common && value) {
    api.defaults.headers.common[key] = value;
  }
}

const token = Cookies.get('Authorization');
token && setHeader('Authorization', `Bearer ${token}`);

export async function currentUser(): Promise<UserInfo> {
  try {
    const { data } = await api.get<UserInfo>('/user/current');
    return data;
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}

export async function login(credentials: Credentials): Promise<LoginInfo> {
  try {
    const { data } = await api.post<LoginInfo>('/user/login', credentials);
    Cookies.set('Authorization', data.access_token, { expires: 1 });
    setHeader('Authorization', `Bearer ${data.access_token}`);
    return data;
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}

export async function logout(): Promise<LogoutInfo> {
  try {
    const { data } = await api.get<LogoutInfo>('/user/logout');
    Cookies.remove('Authorization');
    deleteHeader('Authorization');
    return data;
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}

export async function analoguesPost(ids: number[]): Promise<ObjectInformation[]> {
  try {
    const { data } = await api.post<Record<string, ObjectInformation>>('/analogues', ids);
    return Object.values(data);
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}

export async function benchmarksPost(filters: Filters): Promise<ObjectInformation[]> {
  try {
    const { data } = await api.post<Record<string, ObjectInformation>>('/benchmarks', filters);
    return Object.values(data);
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}

export async function download(id: string): Promise<Blob> {
  try {
    const data = await api.post('/download', { id }, { responseType: 'blob' });
    return new Blob([data as unknown as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}

export async function list(last: boolean): Promise<UserFile[]> {
  try {
    const { data } = await api.get<Record<string, UserFile>>(`/list?last=${last}`);
    return Object.values(data);
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}

export async function poolGet(): Promise<any> {
  try {
    const { data } = await api.get('/pool');
    return data;
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}

export async function poolPost(): Promise<boolean> {
  try {
    const { data } = await api.post('/pool', {});
    return data;
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}

export async function upload(files: UserFile[]): Promise<boolean> {
  try {
    const { data } = await api.post<boolean>('/upload', files);
    return data;
  } catch (e) {
    throw new Error((e as AxiosError<ApiError>)?.response?.data?.message);
  }
}
