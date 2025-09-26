import React from "react";
import { useRef, useEffect } from "react";

export function useDraggable(initialX = 20, initialY = 20) {
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        node.style.left = `${initialX}vw`;
        node.style.top = `${initialY}vh`;
        // node.style.position = 'absolute';
        // node.style.cursor = 'grab';

        const handleMouseDown = (e) => {
            isDragging = true;
            offsetX = e.clientX - node.getBoundingClientRect().left;
            offsetY = e.clientY - node.getBoundingClientRect().top;
            node.style.cursor = "grabbing";
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            node.style.left = `${e.clientX - offsetX}px`;
            node.style.top = `${e.clientY - offsetY}px`;
        }

        const handleMouseUp = () => {
            isDragging = false;
            node.style.cursor = "grab";
        }

        node.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            node.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

    }, [])

    return ref;
}
