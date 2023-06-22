import { createClient as createUrqlClient } from "urql";
import { createPostTypedData, refresh } from "./mutations";

APIURL = "https://api-mumbai.lens.dev";
export const STORAGE_KEY = "LH_STORAGE_KEY";

export const basicClient = new createUrqlClient({
  url: APIURL,
});

export async function refreshAuthToken() {
  const token = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!token) return;
  try {
    const authData = await basicClient
      .mutation(refresh, {
        refreshToken: token.refreshToken,
      })
      .toPromise();

    if (!authData.data) return;

    const { accessToken, refreshToken } = authData.data.refresh;
    const exp = parseJwt(refreshToken).exp;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accessToken,
        refreshToken,
        exp,
      })
    );

    return {
      accessToken,
    };
  } catch (err) {
    console.log("error:", err);
  }
}

export async function createPostTypedDataMutation(request, token) {
  const { accessToken } = await refreshAuthToken();
  const urqlClient = new createUrqlClient({
    url: APIURL,
    fetchOptions: {
      headers: {
        "x-access-token": `Bearer ${accessToken}`,
      },
    },
  });
  const result = await urqlClient
    .mutation(createPostTypedData, {
      request,
    })
    .toPromise();

  return result.data.createPostTypedData;
}
