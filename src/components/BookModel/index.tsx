import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useFBX } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";

const BookModel: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const fbx = useLoader(GLTFLoader, "/shelf.glb");
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => {
    mesh.current.rotation.y += delta;
  });
  return (
    <>
      <primitive
        ref={mesh}
        object={fbx.scene}
        scale={1.25}
        position={[0, -1, 2]}
        rotation={[0, 1.6, 0]}
      />
    </>
  );
};

export default BookModel;
