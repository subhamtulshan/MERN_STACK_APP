import React from "react";
import UserList from "../Component/UserList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      image:"https://images.pexels.com/photos/3584443/pexels-photo-3584443.jpeg?cs=srgb&dl=golden-gate-bridge-san-francisco-3584443.jpg&fm=jpg",
      name: "max",
      placeCount: 2
    }
  ];

  return <UserList items={USERS}></UserList>;
};

export default Users;
