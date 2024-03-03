import { api } from "@/libs/axios";

const URL: string = "/login";

export function login(data: any) {
  return api.post(URL, data);
}
