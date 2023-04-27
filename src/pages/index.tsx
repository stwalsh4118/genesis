import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Canvas, ThreeElements, useFrame, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useFBX } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  // load the book model
  const fbx = useLoader(GLTFLoader, "/quillbook.glb");

  // const obj = useLoader(OBJLoader, "./book.obj");

  const redirectIfSession = async () => {
    if (session) {
      await router.push("/dashboard");
    }
  };

  useEffect(() => {
    console.log(session);
    session ? void redirectIfSession() : void null;
  }, [session]);

  return (
    <>
      <div className="relative flex-1">
        <Canvas>
          {" "}
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
          <primitive object={fbx} />
        </Canvas>
      </div>
    </>
  );
};

function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (mesh.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default Home;
