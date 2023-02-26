/**
 * Used to manually convert any http-related data
 * Possible use case is to build request url without sending the actual request
 */
export interface HttpTransformerService {
  query(params: Record<string, string>): string;
}
