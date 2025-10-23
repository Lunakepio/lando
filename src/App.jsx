import { Canvas } from "@react-three/fiber"
import { Stars } from "./stars/Stars"
import { Menu } from "./Menu/Menu"
import { Lando } from "./Lando"


function App() {


  return (
    <>
    <div className="canvas-container">
      <Canvas>
        <color attach="background" args={[0xBE0003]} />
        {/* </Stars/> */}
        {/* <Menu/> */}
        <Lando/>
      </Canvas>
    </div>
    </>
  )
}

export default App
