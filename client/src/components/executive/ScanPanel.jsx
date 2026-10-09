import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, ScanLine, Smartphone, Upload, X } from "lucide-react";
import toast from "react-hot-toast";


const CameraModal = ({ onCapture, onClose, onUseNative }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            })
            .then((stream) => {
                if (cancelled) return stream.getTracks().forEach((t) => t.stop());
                streamRef.current = stream;
                videoRef.current.srcObject = stream;
                setReady(true);
            })
            .catch(() =>
                setError("Could not open the camera. Please allow camera permission."),
            );

        return () => {
            cancelled = true;
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    const capture = () => {
        const video = videoRef.current;
        if (!video?.videoWidth) return;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        canvas.toBlob(
            (blob) => {
                if (!blob) return toast.error("Could not capture photo");
                onCapture(new File([blob], `card-${Date.now()}.jpg`, { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.92,
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex h-dvh w-screen flex-col bg-black sm:items-center sm:justify-center sm:bg-slate-900/60 sm:p-4 sm:backdrop-blur-sm">
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-black sm:w-full sm:max-w-lg sm:flex-none sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:shadow-2xl">
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-linear-to-b from-black/70 to-transparent px-4 pb-6 pt-4 sm:static sm:bg-none sm:pb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-white sm:text-slate-500">
                        Scan visiting card
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Close camera"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:bg-slate-100 sm:text-slate-500 sm:hover:bg-red-50 sm:hover:text-red-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative min-h-0 flex-1 bg-black sm:h-80 sm:flex-none sm:bg-white sm:px-4">
                    {error ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </p>
                            <button
                                onClick={onUseNative}
                                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-red-600/25 hover:bg-red-500"
                            >
                                <Smartphone className="h-4 w-4" /> Use phone camera app
                            </button>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="h-full w-full bg-black object-cover sm:rounded-xl"
                            />
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center sm:px-4">
                                <div className="aspect-7/4 w-[88%] rounded-xl border-2 border-dashed border-red-400 shadow-[0_0_0_9999px_rgba(2,6,23,0.55)] sm:shadow-none" />
                            </div>
                            {!ready && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-black px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:bg-white sm:pb-5">
                    <p className="mb-3 text-center text-xs text-slate-400">
                        Place the card inside the frame in good light.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-white/20 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/10 sm:flex-1 sm:border-slate-200 sm:text-slate-600 sm:hover:border-red-300 sm:hover:bg-red-50 sm:hover:text-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={capture}
                            disabled={!ready}
                            aria-label="Capture photo"
                            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-red-600 text-white transition active:scale-95 disabled:opacity-40 sm:h-auto sm:w-auto sm:flex-1 sm:gap-2 sm:rounded-xl sm:border-0 sm:py-3 sm:shadow-lg sm:shadow-red-600/25 sm:hover:bg-red-500"
                        >
                            <Camera className="h-6 w-6 sm:h-4 sm:w-4" />
                            <span className="hidden text-xs font-bold sm:inline">Capture</span>
                        </button>
                        <span className="w-19 sm:hidden" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const OptionButton = ({ icon: Icon, title, hint, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="group flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:border-red-300 hover:bg-red-50/50 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:p-5"
    >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white sm:h-12 sm:w-12">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        <span className="text-[11px] text-slate-400 sm:text-xs">{hint}</span>
    </button>
);

const ScanPanel = ({ onScan, scanning }) => {
    const [preview, setPreview] = useState("");
    const [cameraOpen, setCameraOpen] = useState(false);
    const uploadRef = useRef(null);
    const nativeCameraRef = useRef(null);

    useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

    const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/"))
            return toast.error("Please choose an image file");
        setPreview(URL.createObjectURL(file));
        onScan(file);
    };

    const openScanner = () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            nativeCameraRef.current?.click();
            return;
        }
        setCameraOpen(true);
    };

    const clear = () => {
        setPreview("");
        if (uploadRef.current) uploadRef.current.value = "";
        if (nativeCameraRef.current) nativeCameraRef.current.value = "";
    };

    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 sm:p-6">
            <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-linear-to-r from-transparent via-red-500 to-transparent" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Add a visiting card
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <OptionButton
                    icon={ScanLine}
                    title="Scan card"
                    hint="Open camera"
                    onClick={openScanner}
                    disabled={scanning}
                />
                <OptionButton
                    icon={Upload}
                    title="Upload card"
                    hint="Choose an image"
                    onClick={() => uploadRef.current?.click()}
                    disabled={scanning}
                />
            </div>

            <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <input
                ref={nativeCameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {preview && (
                <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img
                        src={preview}
                        alt="Card preview"
                        className="max-h-48 w-full object-contain sm:max-h-56"
                    />
                    {scanning ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-sm">
                            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                            <p className="text-xs font-medium text-slate-600">Reading card...</p>
                        </div>
                    ) : (
                        <button
                            onClick={clear}
                            aria-label="Remove image"
                            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:border-red-300 hover:text-red-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}

            {cameraOpen && (
                <CameraModal
                    onClose={() => setCameraOpen(false)}
                    onCapture={(file) => {
                        setCameraOpen(false);
                        handleFile(file);
                    }}
                    onUseNative={() => {
                        setCameraOpen(false);
                        nativeCameraRef.current?.click();
                    }}
                />
            )}
        </div>
    );
};

export default ScanPanel;