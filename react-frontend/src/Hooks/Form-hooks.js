import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUTCHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId!==undefined) {
          if (inputId === action.inputId) {
            formIsValid = formIsValid && action.isValid;
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isFormValid: formIsValid
      };
    case "SETDATA": {
      return {
        inputs: action.inputs,
        isFormValid: action.isFormValid
      };
    }
    default:
      return state;
  }
};

export const useForm = (inputs, isFormValid) => {
  const inputChangeHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUTCHANGE",
      inputId: id,
      value: value,
      isValid: isValid
    });
  }, []);

  const setFormData = useCallback((inputs, isformValid) => {
    dispatch({
      type: "SETDATA",
      inputs: inputs,
      isFormValid: isformValid
    });
  }, []);

  const [inputState, dispatch] = useReducer(formReducer, {
    inputs: inputs,
    isFormValid: isFormValid
  });

  return [inputState, inputChangeHandler, setFormData];
};
