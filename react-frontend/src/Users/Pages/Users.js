import React, { useEffect, useState } from "react";
import UserList from "../Component/UserList";
import ErrorLoading from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import { useHttpsClient } from "../../Hooks/Https-hooks";
const Users = () => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState();
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [isLoading, isError, submitRequest, clearError] = useHttpsClient();
  useEffect(() => {
    // const submitRequest = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await fetch("http://localhost:5000/api/users/");
    //     const responseData = await response.json();
    //     if (!response.ok) {
    //       throw new Error(responseData.message);
    //     }
    //     // console.log(responseData.User.length);
    //     setLoadedUsers(responseData.User);
    //     setIsLoading(false);
    //   } catch (err) {
    //     console.log(err);
    //     setIsLoading(false);
    //     setIsError(err.message || "something went wrong in FT");
    //   }
    // };
    // submitRequest();
    const getUsers = async () => {
      try {
        const responseData = await submitRequest(
          "http://localhost:5000/api/users/",
          "GET"
        );
        setLoadedUsers(responseData.User);
      } catch (err) {}
    };
    getUsers();
  }, [submitRequest]);
  // const USERS = [
  //   {
  //     id: "u1",
  //     image:
  //       "https://images.pexels.com/photos/3584443/pexels-photo-3584443.jpeg?cs=srgb&dl=golden-gate-bridge-san-francisco-3584443.jpg&fm=jpg",
  //     name: "max",
  //     placeCount: 2
  //   }
  // ];

  const cancleHandler = () => {
    clearError();
  };
  return (
    <React.Fragment>
      {isLoading ? <LoadingSpinner asOverlay></LoadingSpinner> : null}
      <ErrorLoading error={isError} onClear={cancleHandler}></ErrorLoading>
      <UserList items={loadedUsers}></UserList>
    </React.Fragment>
  );
};

export default Users;
