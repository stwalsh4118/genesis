import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useFBX } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";

const BookModel: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const fbx = useLoader(
    GLTFLoader,
    "/quillbook.glb"
  ) as unknown as THREE.Object3D;

  return (
    <>
      <primitive object={fbx.scene} scale={1.25} rotation={[1.3, 0, 0]} />
    </>
  );
};

export default BookModel;
