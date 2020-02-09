import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../Shared/Components/FormElements/Input";
import "./PlaceForm.css";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../Shared/Components/Util/validators";
import { useForm } from "../../Hooks/Form-hooks";
import { useHttpsClient } from "../../Hooks/Https-hooks";
import { AuthContext } from "../../Context/Auth_Context";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";

const Places = () => {
  const [isLoading, isError, createPlace, clearError] = useHttpsClient();
  // const [userId,setUserId] = useState(null);
  const auth = useContext(AuthContext);
  const history = useHistory();
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
  const submitHandler = async event => {
    event.preventDefault();
    try {
      const responseData = await createPlace(
        "http://localhost:5000/api/places/",
        "POST",
        { "Content-Type": "application/json" },
        JSON.stringify({
          title: inputState.inputs.title.value,
          address: inputState.inputs.address.value,
          description: inputState.inputs.description.value,
          creator: auth.userId
        })
      );
      history.push("/");
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <ErrorModal error={isError} onClear={clearError}></ErrorModal>
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
    </React.Fragment>
  );
};

export default Places;
