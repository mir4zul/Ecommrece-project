import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function Product({ product }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

    const updateZoomPosition = (event) => {
        const { left, top, width, height } =
            event.currentTarget.getBoundingClientRect();

        setZoomPosition({
            x: Math.max(
                0,
                Math.min(100, ((event.clientX - left) / width) * 100),
            ),
            y: Math.max(
                0,
                Math.min(100, ((event.clientY - top) / height) * 100),
            ),
        });
    };

    const toggleTouchZoom = (event) => {
        if (event.pointerType === "touch" || event.pointerType === "pen") {
            setZoomPosition({ x: 50, y: 50 });
            setIsZoomed((current) => !current);
        }
    };

    const toggleKeyboardZoom = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setZoomPosition({ x: 50, y: 50 });
            setIsZoomed((current) => !current);
        }
    };

    return (
        <div className="mx-auto w-full">
            <div
                role="button"
                tabIndex={0}
                aria-label={
                    isZoomed ? "Zoom out product image" : "Zoom product image"
                }
                className={`group relative aspect-square w-full touch-manipulation overflow-hidden rounded-lg bg-gray-100 outline-none ring-red-500 focus-visible:ring-2 ${
                    isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {
                        setIsZoomed(true);
                    }
                }}
                onPointerMove={(event) => {
                    if (event.pointerType === "mouse") {
                        updateZoomPosition(event);
                    }
                }}
                onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") {
                        setIsZoomed(false);
                        setZoomPosition({ x: 50, y: 50 });
                    }
                }}
                onPointerUp={toggleTouchZoom}
                onKeyDown={toggleKeyboardZoom}
            >
                <img
                    src={product.image}
                    alt={product.name}
                    draggable="false"
                    className="h-full w-full select-none object-contain transition-transform duration-200 ease-out"
                    style={{
                        transform: isZoomed ? "scale(2)" : "scale(1)",
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                />

                <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 p-2 text-gray-800 shadow-md dark:bg-gray-900/90 dark:text-gray-100">
                    {isZoomed ? (
                        <ZoomOut className="size-5" aria-hidden="true" />
                    ) : (
                        <ZoomIn className="size-5" aria-hidden="true" />
                    )}
                </span>

                {!isZoomed && (
                    <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/65 px-3 py-1.5 text-xs text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                        Hover or tap to zoom
                    </span>
                )}
            </div>

            <div className="mt-4 flex justify-center">
                <button
                    type="button"
                    onClick={() => {
                        setZoomPosition({ x: 50, y: 50 });
                        setIsZoomed((current) => !current);
                    }}
                    className={`h-20 w-20 overflow-hidden rounded-md border-2 bg-gray-100 p-1 transition sm:h-24 sm:w-24 ${
                        isZoomed
                            ? "border-red-500"
                            : "border-gray-200 hover:border-red-400"
                    }`}
                    aria-label="Toggle product image zoom"
                >
                    <img
                        src={product.image}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </button>
            </div>
        </div>
    );
}
