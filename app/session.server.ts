// app/session.server.ts
import { createCookieSessionStorage } from "remix";

export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secrets: [process.env.APP_TOKEN_SECRET as string],
        secure: process.env.NODE_ENV === "production",
    },
});

export let { getSession, commitSession, destroySession } = sessionStorage;