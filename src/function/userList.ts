import { getAccessToken } from "./aad";

export async function userList(c: any) {
  const access_token = await getAccessToken(c);
  if (access_token == null) {
    return c.json({ msg: "Failed to get Azure AD access token" });
  }
  const url =
    "https://graph.microsoft.com/v1.0/users?$select=displayName,userPrincipalName&$expand=extensions&$top=999&$filter=accountEnabled eq true";
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  };

  try {
    const r = await fetch(url, options);
    let j: any = await r.json();
    j = j.value.filter(
      (i: any) => !i.userPrincipalName.endsWith("onmicrosoft.com")
    );

    j = j.map((i: any) => {
      const obj = i;
      if (i.extensions) {
        const find = i.extensions.filter((k: any) => k.id == "twfido");
        if (find.length > 0) {
          obj.twid = find[0].twid ? "set" : "unset";
          obj.pwd = find[0].pwd ? "set" : "unset";
          obj.pwd_expiry = find[0].pwd_expiry.replace("T", " ");
        } else {
          obj.twid = "unset";
          obj.pwd = "unset";
          obj.pwd_expiry = "";
        }
      } else {
        obj.twid = "unset";
        obj.pwd = "unset";
        obj.pwd_expiry = "";
      }

      return obj;
    });

    return c.json(j);
  } catch (err) {
    return c.json({ msg: err });
  }
}
