export interface Authorization {
  accountId: string;
}

export interface HttpResponse<Body> {
  body?: Body;
  headers?: Record<string, string>;
  statusCode?: number;
}
