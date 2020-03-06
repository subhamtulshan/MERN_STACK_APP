import React, { useRef, useState, useEffect } from "react";
import "./imageUpload.css";

import Button from "./Button";

const ImageUpload = props => {
  const [PickedFile, setPickedFile] = useState();
  const [PreviewUrl, setPreviewUrl] = useState();
  const [Isvalid, setIsvalid] = useState(false);

  const filepicker = useRef();

  useEffect(() => {
    if (!PickedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(PickedFile);
    console.log(PreviewUrl);
  }, [PickedFile]);

  const pickedImageHandler = event => {
    let pickedfile;
    let fileisValid = Isvalid;

    if (event.target.files && event.target.files.length === 1) {
      pickedfile = event.target.files[0];
      fileisValid = true;
      setPickedFile(pickedfile);
      setIsvalid(fileisValid);
    } else {
      fileisValid = false;
      setIsvalid(fileisValid);
    }

    props.onInput(props.id, pickedfile, fileisValid);
  };

  const pickImageHandler = () => {
    filepicker.current.click();
  };

  return (
    <div className="form-control">
      <input
        ref={filepicker}
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={pickedImageHandler}
      ></input>
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {PreviewUrl ? (
            <img src={PreviewUrl} alt="preview"></img>
          ) : (
            <p>please pick an image</p>
          )}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Image
        </Button>
      </div>
      {!Isvalid && <p>{props.errortext}</p>}
    </div>
  );
};

export default ImageUpload;
