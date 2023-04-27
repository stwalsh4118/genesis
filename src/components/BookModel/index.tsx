import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useFBX } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";

export const BookModel: React.FC = () => {
  const fbx = useLoader(GLTFLoader, "/quillbook.glb");

  return (
    <>
      <primitive object={fbx} />
    </>
  );
};
