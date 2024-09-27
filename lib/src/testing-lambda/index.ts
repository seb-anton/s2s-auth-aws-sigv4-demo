import { aws4Interceptor } from 'aws4-axios';
import axios from 'axios';

export async function handler(): Promise<any> {
  try {
    const axiosClient = axios.create();

    const interceptor = aws4Interceptor({
      instance: axiosClient,
      options: {
        region: process.env.AWS_REGION,
        service: 'execute-api'
      }
    });

    if (process.env.SIGN_REQUEST === 'true') {
      axiosClient.interceptors.request.use(interceptor);
    }

    const url = process.env.API_URL as string;
    const endpoint = url + process.env.API_PATH;

    console.log('URL: ' + endpoint);

    const response = await axiosClient.get(endpoint);

    console.log(response);

    return {
      statusCode: 200,
      body: response.data
    };
  } catch (error) {

    return {
      statusCode: 200,
      error: error
    };
  }
}