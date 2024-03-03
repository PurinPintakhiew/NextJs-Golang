import { api } from "@/libs/axios";

const URL: string = "/users";

export function getUsers() {
  return api.get(URL);
}
