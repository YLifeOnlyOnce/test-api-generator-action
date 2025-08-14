# Example API

A sample API to demonstrate the generator

## Installation

```bash
npm install api-project-template
```

## Usage

```typescript
import axios from 'axios';
import { AxiosHttpClient, ApiClient } from 'api-project-template';

// Create axios instance with your configuration
const axiosInstance = axios.create({
  baseURL: 'https://your-api-base-url.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token'
  }
});

// Add interceptors if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token, logging, etc.
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Create HTTP client and API client
const httpClient = new AxiosHttpClient(axiosInstance);
const apiClient = new ApiClient(httpClient);

// Use the API client
async function example() {
  try {
    const result = await apiClient.someMethod();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## API Reference

This package provides the following exports:

- `ApiClient`: Main API client class
- `AxiosHttpClient`: HTTP client implementation using axios
- `HttpClient`: HTTP client interface
- Type definitions for all API endpoints and data models

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch for changes during development
npm run dev
```

## License

MIT
