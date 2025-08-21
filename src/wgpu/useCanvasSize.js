import { useEffect, useState } from "react"

const asideWidth = 280 // aside width is 280px
const asideHeight = 280 // aside width is 280px

const useCanvasSize = () => {
    const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 })
    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({
                width: document.body.clientWidth/1.7,
                height: document.body.clientHeight 
            })
        }
        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return canvasSize

}
export default useCanvasSize