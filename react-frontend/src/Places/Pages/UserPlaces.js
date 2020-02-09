import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../Component/PlaceList";
import { useHttpsClient } from "../../Hooks/Https-hooks";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const [isLoading, isError, GetPlace, clearError] = useHttpsClient();
  const userId = useParams().userId;
  let [loadedPlace, setLoadedPlace] = useState();

  useEffect(() => {
    const getallplacebyId = async () => {
      try {
        const responseData = await GetPlace(
          "http://localhost:5000/api/places/user/" + userId
        );
        setLoadedPlace(responseData.place);
      } catch (err) {}
    };
    getallplacebyId();
  }, [GetPlace, userId]);

  const deletePlace = id => {
    setLoadedPlace(prevstate => {
      prevstate.filter(place => place.id !== id);
    });
  };
  // const loadedPlace = DUMMY_PLACES.filter(place => place.creator === userId);
  return (
    <React.Fragment>
      <ErrorModal error={isError} onClear={clearError}></ErrorModal>
      <PlaceList item={loadedPlace} deletePlace={deletePlace} />
      {isLoading ? <LoadingSpinner asOverlay></LoadingSpinner> : null}
    </React.Fragment>
  );
};

export default UserPlaces;
