import React from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CropDialog from "./CropDialog";

const PIXEL_RATIO = 4;
export default function CropImage(props) {
  const [crop, setCrop] = React.useState({
    unit: "%",
    width: 80,
    aspect: 16 / 9,
  });

  const [src, setSrc] = React.useState();

  const [completedCrop, setCompletedCrop] = React.useState();

  const [open, setModalOpen] = React.useState(false);

  const [preview, setPreview] = React.useState();
  const [croppedFile, setCroppedFile] = React.useState();

  const imgRef = React.useRef(null);

  const previewCanvasRef = React.useRef(null);

  const onLoad = React.useCallback((img) => {
    imgRef.current = img;
  }, []);

  React.useEffect(() => {
    if (props.selectedFile) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(props.selectedFile);
      setModalOpen(true);
    }
  }, [props.selectedFile]);

  React.useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * PIXEL_RATIO;
    canvas.height = crop.height * PIXEL_RATIO;

    ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
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

    canvas.toBlob((blob) => {
      const previewUrl = URL.createObjectURL(blob);
      const newFile = new File([blob], props.selectedFile.name);

      setPreview(previewUrl);
      setCroppedFile(newFile);
    }, "image/jpg");
  }, [completedCrop]);

  return (
    <>
      <CropDialog
        open={open}
        onHide={() => setModalOpen(false)}
        onSave={() => {
          props.onSave({ file: croppedFile, preview });
          setModalOpen(false);
        }}
      >
        <ReactCrop
          src={src}
          style={{ maxHeight: "550px" }}
          crop={crop}
          locked
          onChange={(crop, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          onImageLoaded={onLoad}
        />
      </CropDialog>

      <canvas ref={previewCanvasRef} style={{ width: 0, height: 0 }} />
    </>
  );
}
