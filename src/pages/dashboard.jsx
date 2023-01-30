// react hooks
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "src/utils/firebase";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
// components
import Message from "@/components/message";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // see if user is dashboard & get user posts
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  // get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  // Delete Post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  return (
    <div className="">
      <h1 className="font-bold text-lg">Your posts</h1>
      <div className="border border-gray-200 p-6 rounded-lg my-4 max-h-96 overflow-y-scroll">
        {posts.map((post) => (
          <Message {...post} key={post.id}>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => deletePost(post.id)}
                className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
              >
                <BsTrash2Fill className="text-2xl" /> Delete
              </button>
              <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                <AiFillEdit className="text-2xl" /> Edit
              </button>
            </div>
          </Message>
        ))}
      </div>
      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 my-6 rounded-sm"
        onClick={() => auth.signOut()}
      >
        sign out
      </button>
    </div>
  );
}
