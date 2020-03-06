import React from "react";
import Avatar from "../../Shared/Components/UIElements/Avatar";
import Card from "../../Shared/Components/UIElements/Card";
import { Link } from "react-router-dom";
import "./UserItem.css";

const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar
              image={`http://localhost:5000/${props.image}`}
              alt={props.name}
            ></Avatar>
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>{props.placeCount}</h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
