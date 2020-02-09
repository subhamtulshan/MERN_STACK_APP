import React, { useEffect, useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../Shared/Components/Util/validators";
import "./PlaceForm.css";
import { useForm } from "../../Hooks/Form-hooks";
import Card from "../../Shared/Components/UIElements/Card";
import { useHttpsClient } from "../../Hooks/Https-hooks";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import { AuthContext } from "../../Context/Auth_Context";

const UpdatePlace = props => {
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [isLoading, isError, editPlace, clearError] = useHttpsClient();
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
  useEffect(() => {
    const getPlace = async () => {
      try {
        const responseData = await editPlace(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    };
    getPlace();
  }, [editPlace, placeId, setLoadedPlace, setFormData]);

  const submitHandler = async event => {
    event.preventDefault();
    console.log(event);
    try {
      await editPlace(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        { "Content-Type": "application/json" },
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        })
      );
      history.push(`/${auth.userId}/places`);
    } catch (err) {}
  };

  if (!loadedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find any place</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={isError} onClear={clearError}></ErrorModal>
      {loadedPlace && (
        <form className="place-form" onSubmit={submitHandler}>
          {isLoading ? <LoadingSpinner asOverlay></LoadingSpinner> : null}
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errortext="please enter valid text"
            onInput={inputChangeHandler}
            valid={true}
            value={loadedPlace.title}
          ></Input>
          <Input
            id="description"
            type="textarea"
            label="description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errortext="please enter valid description"
            onInput={inputChangeHandler}
            valid={true}
            value={loadedPlace.description}
          ></Input>
          <Button type="submit" disabled={!formState.isFormValid}>
            Update Place
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
