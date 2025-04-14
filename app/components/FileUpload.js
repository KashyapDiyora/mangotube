import { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";

export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image",
    id,
    styleProperty=""
}) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const onError = (err) => {
        setUploading(false);
        setError(err?.message);
    };

    const handleSuccess = (res) => {
        onSuccess(res);
        setUploading(false);
        setError(null);
    };

    const onUploadProgress = (progress) => {
        if (progress.lengthComputable && onProgress) {
            const percentComplete = (progress.loaded / progress.total) * 100;
            onProgress(Math.round(percentComplete));
        }
    };

    const onUploadStart = () => {
        setUploading(true);
        setError(null);
    };

    return (
        <div className="App">
            <IKUpload
                fileName={fileType === "video" ? "video" : "image"}
                validateFile={(file) => file.size < 2000000}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={onUploadProgress}
                onUploadStart={onUploadStart}
                accept={fileType === "video" ? "video/*" : "image/*"}
                className={`file-input file-input-bordered w-full ${styleProperty ? styleProperty : ""}`}
                useUniqueFileName={true}
                folder={fileType === "video" ? "/videos" : "/images"}
                id={id}
            />
            {uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                </div>
            )}

            {error && <div className="text-error text-sm">{error}</div>}
        </div>
    );
}
