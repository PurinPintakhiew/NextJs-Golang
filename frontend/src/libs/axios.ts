import Axios from "axios";
import { useRouter } from "next/router";
import { getSession, signOut } from "next-auth/react";

const createAxiosInstance = (baseURL: any) => {
  const instance = Axios.create({
    baseURL,
  });

  instance.interceptors.request.use(
    async (config) => {
      const session: any = await getSession();

      if (session) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: any) => {
      return response;
    },
    (error) => {
      if (error.response) {
        const status = error.response.status;

        if (status === 401 || status === 403) {
          signOut();
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createAxiosInstance(process.env.NEXT_PUBLIC_API_URL);

export { api };
