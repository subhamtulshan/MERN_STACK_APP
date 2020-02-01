import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../Shared/Components/Util/validators";
import "./PlaceForm.css";
import { useForm } from "../../Hooks/Form-hooks";
import Card from "../../Shared/Components/UIElements/Card";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: "u1"
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: "u2"
  }
];
const UpdatePlace = props => {
  const placeId = useParams().placeId;

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false
      },
      description: {
        value: "",
        isValid: false
      }
    },
    false
  );
  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true
          },
          description: {
            value: identifiedPlace.description,
            isValid: true
          }
        },
        true
      );
    }
  }, [setFormData, identifiedPlace]);

  const submitHandler = event => {
    event.preventDefault();
    console.log(formState);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find any place</h2>
        </Card>
      </div>
    );
  }

  return (
    formState.inputs.title.value && (
      <form className="place-form" onSubmit={submitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errortext="please enter valid text"
          onInput={inputChangeHandler}
          valid={true}
          value={formState.inputs.title.value}
        ></Input>
        <Input
          id="description"
          type="textarea"
          label="description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errortext="please enter valid description"
          onInput={inputChangeHandler}
          valid={true}
          value={formState.inputs.description.value}
        ></Input>
        <Button type="submit" disabled={!formState.isFormValid}>
          Update Place
        </Button>
      </form>
    )
  );
};

export default UpdatePlace;
