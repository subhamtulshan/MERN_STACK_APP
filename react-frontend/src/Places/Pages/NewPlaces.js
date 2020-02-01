import React from "react";
import Input from "../../Shared/Components/FormElements/Input";
import "./PlaceForm.css";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../Shared/Components/Util/validators";
import { useForm } from "../../Hooks/Form-hooks";

const Places = () => {
  const [inputState, inputChangeHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false
      },
      description: {
        value: "",
        isValid: false
      },
      address: {
        value: "",
        isValid: false
      }
    },
    false
  );
  const submitHandler = event => {
    event.preventDefault();
    console.log(inputState);
  };
  return (
    <form className="place-form" onSubmit={submitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errortext="please enter valid text"
        onInput={inputChangeHandler}
      ></Input>
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errortext="please enter valid description(atleast 5 char)"
        onInput={inputChangeHandler}
      ></Input>
      <Input
        id="address"
        element="input"
        type="text"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errortext="please enter valid address"
        onInput={inputChangeHandler}
      ></Input>
      <Button type="submit" disabled={!inputState.isFormValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default Places;
