export class WebResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
