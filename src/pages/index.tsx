import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Canvas, ThreeElements, useFrame, useLoader } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { OrbitControls } from "@react-three/drei";

const BookModel = dynamic(() => import("@/components/BookModel"), {
  ssr: false,
});

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  // load the book model

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
          {/* <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} /> */}
          <BookModel></BookModel>
          <OrbitControls />
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
