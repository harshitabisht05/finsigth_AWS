import api from "./api";
export async function connectAwsAccount(payload) { const { data } = await api.post("/aws/connect", payload); return data; }
export async function fetchAwsAccounts() { const { data } = await api.get("/aws/accounts"); return data; }
