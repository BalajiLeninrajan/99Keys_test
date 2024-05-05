import { useCallback, useState } from "react";
import { FloorPlan, Directions, FloorTypes } from "./FloorPlan";
import getCroppedImg from "./Crop";
import Cropper from "react-easy-crop";
import "./App.css";

function App() {
    const [name, setName] = useState("");
    const [intSize, setIntSize] = useState(0);
    const [extSize, setExtSize] = useState(0);
    const [direction, setDirection] = useState(Directions.north);
    const [floorType, setFloorType] = useState(FloorTypes.studio);

    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const [fps, setFps] = useState([]);

    const handleImageUpload = async (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const saveFloorPlan = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation
            );
            setCroppedImage(croppedImage);
        } catch (e) {
            console.error(e);
        }

        let newFloorPlan = new FloorPlan(
            croppedImage,
            name,
            intSize,
            extSize,
            direction,
            floorType
        );

        setName("");
        setIntSize(0);
        setExtSize(0);
        setDirection(Directions.north);
        setFloorType(FloorTypes.studio);

        setFps([...fps, newFloorPlan]);
        console.log(fps);

        setImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        setCroppedImage(null);
    }, [croppedAreaPixels, rotation, image]);

    const repopulate = (index) => {
        setName(fps[index].name);
        setIntSize(fps[index].intSize);
        setExtSize(fps[index].extSize);
        setDirection(fps[index].direction);
        setFloorType(fps[index].floorType);
    };

    return (
        <>
            <label>
                <input
                    type="file"
                    name="cover"
                    onChange={handleImageUpload}
                    accept="img/*"
                    style={{
                        display: image === null ? "block" : "none",
                        marginBottom: "20px",
                    }}
                />
            </label>
            <div>
                <div
                    className="container"
                    style={{
                        display: image === null ? "none" : "block",
                    }}
                >
                    <div className="crop-container">
                        <Cropper
                            image={image}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            showGrid={false}
                            aspect={4 / 3}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            onRotationChange={setRotation}
                        />
                    </div>
                    <div className="controls">
                        <label>
                            <input
                                className="control"
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) =>
                                    setZoom(parseFloat(e.target.value))
                                }
                            />
                        </label>
                        <input
                            className="control"
                            type="button"
                            value="↺"
                            onClick={() => setRotation((rotation - 90) % 360)}
                        />
                        <input
                            className="control"
                            type="button"
                            value="↻"
                            onClick={() => setRotation((rotation + 90) % 360)}
                        />
                    </div>
                </div>
                <form>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label>
                        Interior Size:
                        <input
                            type="number"
                            value={intSize}
                            onChange={(e) => setIntSize(e.target.value)}
                        />
                    </label>
                    <label>
                        External Size:
                        <input
                            type="number"
                            value={extSize}
                            onChange={(e) => setExtSize(e.target.value)}
                        />
                    </label>
                    <label>
                        Direction:
                        <select
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                        >
                            {Object.values(Directions).map((dir, index) => (
                                <option key={index} value={dir}>
                                    {dir}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Floor Type:
                        <select
                            value={floorType}
                            onChange={(e) => setFloorType(e.target.value)}
                        >
                            {Object.values(FloorTypes).map((dir, index) => (
                                <option key={index} value={dir}>
                                    {dir}
                                </option>
                            ))}
                        </select>
                    </label>
                    <input
                        className="submit"
                        type="button"
                        value="Submit"
                        onClick={saveFloorPlan}
                    />
                </form>
            </div>
            <div>
                <ul>
                    {fps.map((floorPlan, index) => (
                        <li key={index} onClick={repopulate}>
                            {floorPlan.name}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default App;
