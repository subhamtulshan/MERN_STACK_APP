import React, { useState, useContext } from "react";
import Card from "../../Shared/Components/UIElements/Card";
import "./PlaceItem.css";
import Button from "../../Shared/Components/FormElements/Button";
import Modal from "../../Shared/Components/UIElements/Modal";
import Map from "../../Shared/Components/UIElements/Map";
import { AuthContext } from "../../Context/Auth_Context";
import { useHttpsClient } from "../../Hooks/Https-hooks";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";

const PlaceItem = props => {
  const [showmap, setshowmap] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isLoading, isError, deletePlace, clearError] = useHttpsClient();

  const cancleModalHandler = () => {
    setConfirmModal(false);
  };

  const OpenModalHandler = () => {
    setConfirmModal(true);
  };
  const confirmModalHandler = async () => {
    setConfirmModal(false);
    try {
      await deletePlace(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE"
      );
      props.deletePlace(props.id);
    } catch (err) {}
  };

  const openMapHandler = () => {
    setshowmap(true);
  };
  const hideMapHandler = () => {
    setshowmap(false);
  };

  const auth = useContext(AuthContext);
  return (
    <React.Fragment>
      <ErrorModal error={isError} onClear={clearError}></ErrorModal>
      <Modal
        show={showmap}
        onCancle={hideMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={hideMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={14}></Map>
        </div>
      </Modal>
      <Modal
        show={confirmModal}
        onCancle={cancleModalHandler}
        header="Are You Sure?"
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={cancleModalHandler}>Cancle</Button>
            <Button onClick={confirmModalHandler}>Delete</Button>
          </React.Fragment>
        }
      >
        <h2>Are you sure you want to delete? this cant be undone!</h2>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}

          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && (
              <Button Danger onClick={OpenModalHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
