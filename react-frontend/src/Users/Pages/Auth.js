import React, { useState, useContext } from "react";
import "./Auth.css";
import { useForm } from "../../Hooks/Form-hooks";
import Button from "../../Shared/Components/FormElements/Button";
import Input from "../../Shared/Components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../Shared/Components/Util/validators";

import Card from "../../Shared/Components/UIElements/Card";
import { AuthContext } from "../../Context/Auth_Context";

const Auth = props => {
  const [LoginMode, setLoginMode] = useState(true);
  const auth = useContext(AuthContext);
  const [inputState, inputChangeHandler, setFormData] = useForm(
    {
      Email: {
        value: "",
        isValid: false
      },
      Password: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    console.log(LoginMode);
    if (LoginMode) {
      setFormData(
        {
          ...inputState.inputs,
          Name: {
            value: "",
            isValid: false
          }
        },
        false
      );
    } else {
      setFormData(
        {
          ...inputState.inputs,
          Name: undefined
        },
        inputState.inputs.Email.isValid && inputState.inputs.Password.isValid
      );
    }
    setLoginMode(!LoginMode);
  };

  const submitHandler = event => {
    event.preventDefault();
    auth.login();
    console.log(inputState);
  };

  return (
    <Card className="authentication">
      <h2>Login Required</h2>
      <form className="place-form" onSubmit={submitHandler}>
        {!LoginMode && (
          <Input
            id="Name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errortext="please enter Name"
            onInput={inputChangeHandler}
          ></Input>
        )}
        <Input
          id="Email"
          element="input"
          type="text"
          label="Email"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          errortext="please enter valid email"
          onInput={inputChangeHandler}
        ></Input>
        <Input
          id="Password"
          element="input"
          label="Password"
          type="text"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errortext="please enter valid password(atleast 5 char)"
          onInput={inputChangeHandler}
        ></Input>
        <Button type="submit" disabled={!inputState.isFormValid}>
          {LoginMode ? "Login" : "SiguUp"}
        </Button>
      </form>
      <h2>
        {LoginMode ? "Not a member" : "Already a member"}
        <Button inverse onClick={switchModeHandler}>
          {!LoginMode ? "Login" : "SiguUp"}
        </Button>
      </h2>
    </Card>
  );
};

export default Auth;
