import React from "react";
import Card from "../../Shared/Components/UIElements/Card";
import Placeitem from "../Component/PlaceItem";
import "./PlaceList.css";
import Button from "../../Shared/Components/FormElements/Button";

const Placelist = props => {
  if (props.item.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. wana create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.item.map(place => (
        <Placeitem
          key={place.id}
          id={place.id}
          title={place.title}
          description={props.description}
          address={place.address}
          creatorId={place.creator}
          image={place.imageUrl}
          coordinates={place.location}
        ></Placeitem>
      ))}
    </ul>
  );
};

export default Placelist;
