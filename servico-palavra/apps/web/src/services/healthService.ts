import { api } from "@/lib/api";

export async function getApiHealth() {
  return api.getText("/health");
}
