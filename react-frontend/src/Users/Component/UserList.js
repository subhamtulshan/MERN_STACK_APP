import React from "react";
import UserItem from "../Component/UserItem";
import './UserList.css'

const UserList = props => {
  if (props.items.length === 0)
    return (
      <div className="center">
        <h1>No user</h1>
      </div>
    );

  return (
    <ul className='users-list'>
      {props.items.map(user => (
        <UserItem
          key={user._id}
          id={user._id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        ></UserItem>
      ))}
    </ul>
  );
};

export default UserList;
