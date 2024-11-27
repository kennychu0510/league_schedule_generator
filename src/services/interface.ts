export interface ServerActionResponse<T> {
  status: 'success' | 'failed';
  message: string;
  data: T;
}
