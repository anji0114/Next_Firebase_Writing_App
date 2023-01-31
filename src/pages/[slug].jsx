import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { auth, db } from "src/utils/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Message from "@/components/message";
import { arrayUnion, doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  // Submit a message
  const submitMessage = async () => {
    if (!auth.currentUser) return router.push("/auth/login");

    if (!message) {
      toast.error("Don't Leave an empty message", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    setMessage("");
  };

  // Get Comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data()?.comments);
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="mt-6">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 text-sm bg-gray-100"
            type="text"
            value={message}
            placeholder="Send a message"
          />
          <button onClick={submitMessage} className="px-4 text-white text-sm bg-cyan-500 ">
            Submit
          </button>
        </div>
        <div className="mt-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message) => (
            <div className="bg-white p-4 my-4 border border-gray-200 shadow-sm" key={message.time}>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  className="w-10 rounded-full"
                  src={message.avatar}
                  width={40}
                  height={40}
                  alt=""
                />
                <h2 className="text-sm font-medium">{message.username}</h2>
              </div>
              <h2 className="">{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
