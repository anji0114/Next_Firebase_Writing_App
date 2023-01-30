import { auth } from "src/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  // see if user is dashboard
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
  };

  // get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div className="">
      <h1>Your posts</h1>
      <div>posts</div>
      <button onClick={() => auth.signOut()}>sing out</button>
    </div>
  );
}
