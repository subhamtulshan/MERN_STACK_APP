import React, { useState, useContext } from "react";
import "./Auth.css";
import { useForm } from "../../Hooks/Form-hooks";
import Button from "../../Shared/Components/FormElements/Button";
import Input from "../../Shared/Components/FormElements/Input";
import ErrorModel from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../Shared/Components/Util/validators";

import Card from "../../Shared/Components/UIElements/Card";
import { AuthContext } from "../../Context/Auth_Context";
import { useHttpsClient } from "../../Hooks/Https-hooks";

const Auth = props => {
  const [LoginMode, setLoginMode] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState();
  const auth = useContext(AuthContext);
  const [isLoading, isError, submitRequest, clearError] = useHttpsClient();
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

  const cancleErrorHandler = () => {
    clearError();
  };

  const submitHandler = async event => {
    event.preventDefault();
    if (LoginMode) {
      // try {
      //   setIsLoading(true);
      //   const response = await fetch("http://localhost:5000/api/users/login", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       email: inputState.inputs.Email.value,
      //       password: inputState.inputs.Password.value
      //     })
      //   });
      //   const responseData = await response.json();
      //   if (!response.ok) {
      //     throw new Error(responseData.message);
      //   }
      //   console.log(responseData);
      //   setIsLoading(false);
      //   auth.login();
      // } catch (err) {
      //   console.log(err);
      //   setIsLoading(false);
      //   setIsError(err.message || "something went wrong in FT");
      // }
      try {
        const responseData = await submitRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          { "Content-Type": "application/json" },
          JSON.stringify({
            email: inputState.inputs.Email.value,
            password: inputState.inputs.Password.value
          })
        );
        auth.login(responseData.user.id);
      } catch (err) {}
    } else {
      try {
        const reponseData = await submitRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          { "Content-Type": "application/json" },
          JSON.stringify({
            name: inputState.inputs.Name.value,
            email: inputState.inputs.Email.value,
            password: inputState.inputs.Password.value
          })
        );
        auth.login(reponseData.user.id);
      } catch (err) {}
    }
  };
  // try {
  //     setIsLoading(true);
  //     const response = await fetch("http://localhost:5000/api/users/signup", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: inputState.inputs.Name.value,
  //         email: inputState.inputs.Email.value,
  //         password: inputState.inputs.Password.value
  //       })
  //     });
  //     const responseData = await response.json();
  //     if (!response.ok) {
  //       throw new Error(responseData.message);
  //     }
  //     console.log(responseData);
  //     setIsLoading(false);
  //     auth.login();
  //   } catch (err) {
  //     console.log(err);
  //     setIsLoading(false);
  //     setIsError(err.message || "something went wrong in FT");
  //   }
  // }
  // };

  return (
    <React.Fragment>
      <ErrorModel error={isError} onClear={cancleErrorHandler}></ErrorModel>
      <Card className="authentication">
        <h2>Login Required</h2>
        {isLoading ? <LoadingSpinner asOverlay></LoadingSpinner> : null}
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
    </React.Fragment>
  );
};

export default Auth;
