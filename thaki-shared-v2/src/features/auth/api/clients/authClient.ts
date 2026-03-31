import {
  createApiClient,
  filterBasicResponse,
  normalizeApiBaseUrl,
} from '../../../../services/utils/apiUtils';

const authClient = createApiClient({
  baseURL: normalizeApiBaseUrl(process.env.API_GATEWAY_URL ?? ''),
  beforeResponse: filterBasicResponse,
});

export default authClient;
