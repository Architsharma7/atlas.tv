import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";
import { publicPaths } from "../constants/publicPaths";
import db from "../components/polybase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [isSubcribed, setIsSubcribed] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const { data: profile, loading } = useActiveProfile();

  const checkUser = async (profileID) => {
    try {
      const user = await db.collection("UserProfile").record(profileID).get();
      // check if the user has an active subscription
      const userData = user.data;
      setIsSubcribed(userData.hasSubscribed);
    } catch (error) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     checkUser();
  //   }, [address]);

  useEffect(() => {
    if (!profile) {
      router.push({
        pathname: "/onboard",
      });
    }
    console.log(profile);
    checkUser(profile.id);
    const authCheck = () => {
      // console.log(router);
      if (
        !isSubcribed &&
        !publicPaths.includes(router.pathname.split("?")[0])
      ) {
        console.log("NOT A PUBLIC ROUTE");
        setAuthorized(false);
        // dispatch(setRedirectLink({ goto: router.asPath }));
        void router.push("https://localhost:3001/checkout");
      } else {
        setAuthorized(true);
      }
    };

    authCheck();

    const preventAccess = () => setAuthorized(false);

    router.events.on("routeChangeStart", preventAccess);
    router.events.on("routeChangeComplete", authCheck);

    return () => {
      router.events.off("routeChangeStart", preventAccess);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [router, router.events, address, isSubcribed]);

  const value = {
    isSubcribed,
    authorized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
