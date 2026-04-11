import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
function FileUpload({ setFile }) {
  const [fileName, setFileName] = useState("");
  console.log(fileName);
  const onDrop = useCallback((file) => {
    setFileName(file[0].path);
    setFile(file[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="p-10 border-2 text-center hover:border-[color:var(--background)] cursor-pointer border-dashed"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <>
          {fileName ? (
            <div>
              <h3 className="text-primary">File uploaded</h3>
              {fileName}
            </div>
          ) : (
            <p className="line-clamp-2">
              Drag n drop some files here, or click to select files
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default FileUpload;
