import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Modal from "./CenteredModal";
// Setting a high pixel ratio avoids blurriness in the canvas crop preview.
const pixelRatio = 4;





function b64ToUint8Array(b64Image) {
  var img = atob(b64Image.split(",")[1]);
  var img_buffer = [];
  var i = 0;
  while (i < img.length) {
    img_buffer.push(img.charCodeAt(i));
    i++;
  }
  return new Uint8Array(img_buffer);
}

export default function App(props) {
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 80,
    aspect:16/9,
    x: 10,
    y: 6,
  });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onSelectFile = (file) => {
 
      setSelectedFile(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(file);
      setModalShow(true);
    
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

useEffect(()=>{
    if(props.isImage){
        onSelectFile(props.selectedFile)
    }

},[props.isImage])

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // const b64Image = canvas.toDataURL("image/jpeg");
    // const u8Image = b64ToUint8Array(b64Image);
     canvas.toBlob((blob)=>{
              const previewUrl =  URL.createObjectURL(blob)
         const newFile = new File([blob], selectedFile.name);
           setFile(newFile);
           setPreview(previewUrl)
     
    },'image/jpg')

  }, [completedCrop]);

  
  return (
    <>
     
      <Modal
        show={modalShow}

        onHide={() => setModalShow(false)}
        onSave={() => {
          
          props.onSave({file,preview});
          setModalShow(false);

        }}
      >
        <ReactCrop
          src={upImg}
          style={{ maxHeight: "550px" }}
          onImageLoaded={onLoad}
          crop={crop}
          locked
          onChange={(c,perc) => setCrop(perc)}
          onComplete={(c) => setCompletedCrop(c)}
        />
      </Modal>

      <canvas
        ref={previewCanvasRef}

        style={{
          width: 0,
          height: 0,
        }}
      />
    </>
  );
}
