// app/auth.server.ts
import { Authenticator, LocalStrategy } from "remix-auth";
import { sessionStorage } from "~/session.server";
import { signUpOrJoin } from "./lib/constants/Data";

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export let authenticator = new Authenticator(sessionStorage);

// Add the local strategy
authenticator.use(
    new LocalStrategy(
        // The strategy will use this URL to redirect the user in case it's logged-in
        // And to know if it should grab the username and password from the request
        // body in case of a POST request
        { loginURL: "/login" },
        async (username, password) => {
            // Find your user data in your database or external service
            let join = await signUpOrJoin(username, password);
            return join ;
        }
    ),
    // The name of the strategy, every strategy has a default name, only add one
    // if you want to override it (e.g. setup more than one strategy)
    "local"
);