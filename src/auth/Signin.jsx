import React, { useState, useEffect } from "react";
import { auth, googleProvider, db } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/ChatPage");
    }
  }, [currentUser, navigate]);

  const Signup = () => {
    navigate("/Signup");
  };

  const handleSignin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateDoc(doc(db, "users", user.uid), { online: true });
      navigate("/ChatPage");
      alert("Signed in successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          online: true,
        });
      } else {
        await updateDoc(userRef, { online: true });
      }

      navigate("/ChatPage");
      alert("Signed in with Google");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white dark:from-gray-900 dark:to-black transition-colors duration-700">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-700 scale-95 hover:scale-100">
        <h2 className="text-3xl font-bold text-center text-[#25D366] dark:text-[#25D366] mb-6">
          Sign In
        </h2>

        <input
          className="w-full p-3 mb-4 border border-[#25D366] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-white dark:bg-gray-700 dark:text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 mb-6 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white dark:bg-gray-700 dark:text-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-[#25D366] hover:bg-[#20c155] text-white py-3 rounded-lg font-semibold transition"
          onClick={handleSignin}
        >
          Sign In
        </button>

        <div className="flex items-center justify-center my-4 text-gray-500 dark:text-gray-300">
          <span className="mx-2">or</span>
        </div>

        <button
          className="w-full bg-white dark:bg-gray-700 dark:border-gray-600 border hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
          onClick={handleGoogleSignin}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign In with Google
        </button>
        <p className="pt-3 text-center text-sm text-gray-500 dark:text-gray-300 cursor-default ">
          Don't have an account?{" "}
          <a onClick={Signup} className="text-blue-600 hover:underline ">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
