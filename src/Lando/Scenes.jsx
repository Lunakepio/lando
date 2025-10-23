import { Environment } from "@react-three/drei"
import { Background } from "./Background"
import { Model } from "./X-wing"

export const Scene1 = () => {
    return (
        <>
        <Background shouldBeFull={false}/>
        <Model wireframe={true}/>
        </>
    )
}

export const Scene2 = () => {
    return (
        <>
        <Background shouldBeFull={true}/>
        <Model wireframe={false}/>
        <Environment preset='city' />
        </>
    )
}