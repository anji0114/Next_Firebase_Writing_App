import { auth, db } from "src/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Post() {
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const submitPost = async (e) => {
    e.preventDefault();

    // Run checks for description
    if (!post.description) {
      toast.error("Description Field empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

     if (post.description.length > 300) {
      toast.error("Description too long", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    // mak a new post
    const collectionRef = collection(db, "posts");
    await addDoc(collectionRef, {
      ...post,
      timestamp: serverTimestamp(),
      user: user.uid,
      username: user.displayName,
      avatar: user.photoURL,
    });

    setPost({ description: "" });
    return router.push("/");
  };

  return (
    <div className="border border-gray-200 my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">Create a new post</h1>
        <div className="py-2">
          <h3 className="text-lg font-medium mt-4 mb-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="border border-gray-200 bg-gray-100 h-48 w-full rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-medium p-2 mt-4 rounded-lg text-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
