import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { useAuth } from "../context/AuthContext.jsx";
import UserCard from "./UserCard";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    // Query users collection, excluding current logged-in user
    const q = query(
      collection(db, "users"),
      where("uid", "!=", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersArray = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setUsers(usersArray);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (users.length === 0) return <p className="p-4">No users found.</p>;

  return (
    <div className="overflow-y-auto max-h-screen p-2">
      {users.map((user) => (
        <UserCard key={user.uid} user={user} />
      ))}
    </div>
  );
};

export default UsersList;
