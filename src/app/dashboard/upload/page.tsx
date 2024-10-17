"use client";
import { useEffect, useRef, useState } from "react";

interface FileData {
  name: string;
  type: string;
  size: number;
  url: string;
}

export default function FileUploader() {
  const [files, setFiles] = useState<{ [key: string]: FileData }>({});
  const [isDragging, setIsDragging] = useState(false);
  const galleryRef = useRef<HTMLUListElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickUploadButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    console.log("upload file");

    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const objectURL = URL.createObjectURL(file);
        setFiles((prevFiles) => ({
          ...prevFiles,
          [objectURL]: {
            name: file.name,
            type: file.type,
            size: file.size,
            url: objectURL,
          },
        }));
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const fileList = event.dataTransfer.files;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const objectURL = URL.createObjectURL(file);
      setFiles((prevFiles) => ({
        ...prevFiles,
        [objectURL]: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: objectURL,
        },
      }));
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDelete = (url: string) => {
    setFiles((prevFiles) => {
      delete prevFiles[url];
      return { ...prevFiles };
    });
  };

  const handleSubmit = () => {
    alert(`Submitted Files:\n${JSON.stringify(files)}`);
    console.log(files);
  };

  const handleCancel = () => {
    setFiles({});
  };

// Helper function to render a file in the gallery
const renderFile = (fileData: FileData) => {
  const isImage = fileData.type.match("image.*");
  const li = document.createElement("li");
  li.id = fileData.url;
  li.className =
    "relative group flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition duration-300 ease-in-out max-h-64";

  const h1 = document.createElement("h1");
  h1.textContent = fileData.name;
  h1.className = "text-gray-900 text-lg font-medium mb-2";

  const size = document.createElement("span");
  size.className = "text-gray-500 text-sm";
  size.textContent =
    fileData.size > 1024
      ? fileData.size > 1048576
        ? `${Math.round(fileData.size / 1048576)}mb`
        : `${Math.round(fileData.size / 1024)}kb`
      : `${fileData.size}b`;

  const deleteButton = document.createElement("button");
  deleteButton.className =
    "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out";
  deleteButton.textContent = "Delete";
  deleteButton.dataset.target = fileData.url;
  deleteButton.addEventListener("click", () => handleDelete(fileData.url));

  if (isImage) {
    const img = document.createElement("img");
    img.src = fileData.url;
    img.alt = fileData.name;
    img.className = "max-w-full max-h-48 object-cover mb-2";
    li.appendChild(img);
  }

  li.appendChild(h1);
  li.appendChild(size);
  li.appendChild(deleteButton);

  return li;
};

  useEffect(() => {
    if (galleryRef.current) {
      // Clear the gallery
      while (galleryRef.current.firstChild) {
        galleryRef.current.removeChild(galleryRef.current.firstChild);
      }

      // Render the files
      Object.values(files).forEach((fileData) => {
        const li = renderFile(fileData);
        galleryRef.current?.appendChild(li);
      });

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            const emptyList = (mutation.target as Element).querySelector(
              "#empty"
            );

            if (emptyList && Object.keys(files).length === 0) {
              emptyList.classList.remove("hidden");
            } else if (emptyList) {
              emptyList.classList.add("hidden");
            }
          }
        });
      });

      observer.observe(galleryRef.current, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
      };
    }
  }, [files]);

  return (
    <div className="bg-gray-500 h-screen w-screen sm:px-8 md:px-16 sm:py-8">
      <main className="container mx-auto max-w-screen-lg h-full">
        <article
          aria-label="File Upload Modal"
          className={`relative h-full flex flex-col bg-white shadow-xl rounded-md ${
            isDragging ? "draggedover" : ""
          }`}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <div
            id="overlay"
            className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
          >
            <i>
              <svg
                className="fill-current w-12 h-12 mb-3 text-blue-700"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
              </svg>
            </i>
            <p className="text-lg text-blue-700">Drop files to upload</p>
          </div>

          <section className="h-full overflow-auto p-8 w-full h-full flex flex-col">
            <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
              <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                <span>Drag and drop your</span>&nbsp;
                <span>files anywhere or</span>
              </p>
              <input
                ref={fileInputRef} // 添加ref引用
                id="hidden-input"
                type="file"
                multiple
                className="hidden" // 移除hidden类
                aria-label="file-upload"
                onChange={handleFileChange}
              />
              <button
                id="button"
                className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                onClick={handleClickUploadButton} // 添加新的点击事件处理函数
              >
                Upload a file
              </button>
            </header>

            <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
              To Upload
            </h1>

            <ul
              id="gallery"
              ref={galleryRef}
              className="flex flex-1 flex-wrap -m-1"
            >
              <li
                id="empty"
                className="h-full w-full text-center flex flex-col items-center justify-center items-center hidden"
              >
                <img
                  className="mx-auto w-32"
                  src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                  alt="no data"
                />
                <span className="text-small text-gray-500">
                  No files selected
                </span>
              </li>
            </ul>
          </section>

          <footer className="flex justify-end px-8 pb-8 pt-4">
            <button
              id="submit"
              className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
              onClick={handleSubmit}
            >
              Upload now
            </button>
            <button
              id="cancel"
              className="ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </footer>
        </article>
      </main>
    </div>
  );
}
