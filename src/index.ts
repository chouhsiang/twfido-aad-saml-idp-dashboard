import { Hono } from "hono";
import { userIndex } from "./function/userIndex";
import { userList } from "./function/userList";
import { userEdit } from "./function/userEdit";
import { userUpdate } from "./function/userUpdate";

type Bindings = {
  AAD_TENANT_ID: string;
  AAD_CLEINT_ID: string;
  AAD_CLEINT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => userIndex(c));
app.get("/users.json", async (c) => await userList(c));
app.get("/:mail", async(c)=> await userEdit(c));
app.post("/:mail", async(c)=> await userUpdate(c));

export default app;
