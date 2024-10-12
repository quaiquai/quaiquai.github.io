import { useEffect, useState } from "react"
import useDevice from "./useDevice"

const useWebGPU = (canvas) => {

    const [context, setContext] = useState()
    const [format, setFormat] = useState('bgra8unorm')
    const { adapter, device, gpu } = useDevice()

    useEffect(() => {

        if (!canvas || !gpu || !adapter) return

        const context = canvas.getContext('webgpu')
        if (context === null) return
        setContext(context)

        //const preferredFormat = context.getPreferredFormat(adapter) //已废弃
        setFormat(gpu.getPreferredCanvasFormat()) // bgra8unorm
        console.log("in useWEBGPU")
    },[canvas, context, format, adapter, device]);

    return { canvas, context, format, adapter, device }
}

export {useWebGPU}