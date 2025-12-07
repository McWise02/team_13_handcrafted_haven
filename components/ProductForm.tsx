// components/ProductForm.tsx
"use client";



import { useState } from "react";
import { useRouter } from "next/navigation";
import {useDropzone} from 'react-dropzone';
import { useUploadThing } from "@/lib/uploadthing";

export type ProductCategory = "METALWORK" | "TEXTILE" | "WOODWORK";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isLoading, setIsLoading] = useState(false);
  const [descriptionError, setDescriptionError] = useState<string>("");

   const [preview, setPreview] = useState<string | null>(null);
   const [file, setFiles] = useState<File | null>(null);
   const [progress, setProgress] = useState<number>(0);

   const { startUpload, isUploading } = useUploadThing("mediaUploader",{
      onClientUploadComplete: (res) => {
        console.log("Files uploaded:", res);
        if (res && res.length > 0) {
          const newImageUrls = res.map((r) => r.ufsUrl);

          setImages((prev) => [...prev, ...newImageUrls]);

        }
        setFiles(null);
        setPreview(null);
        setProgress(0);
        //alert("Upload Successful!");
      },
      onUploadProgress: (progress) => {
        setProgress(progress);
      }
   });
   const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {
      'image/*': [],
      'video/*': []
    },
    multiple: false,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setFiles(file);
    },
   });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const descriptionRaw = (formData.get("description") as string) || "";
    if (descriptionRaw.trim() === "") {
      setDescriptionError("Please enter a description for your product.");
      setIsLoading(false);
      return;
    }

    const data = {
      title: (formData.get("title") as string).trim(),
      price: Math.round(Number(formData.get("price")) * 100),
      description: descriptionRaw.trim() || null,
      craftStory: (formData.get("craftStory") as string)?.trim() || null,
      images: images.length > 0 ? images : [],
      category: formData.get("category") as ProductCategory,
    };

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/dashboard/MyProducts");
        router.refresh();
      } else {
        const error = await res.text();
        alert("Failed to save product: " + error);
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const displayPrice = product?.price !== undefined ? (product.price / 100).toFixed(2) : "";



  

  return (
    
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl mx-auto">
      <div className="rounded-2xl bg-white p-8 shadow-xl border-2 border-blue-200">
        <h2 className="text-3xl font-bold text-blue-900 mb-8">
          {product ? "Edit Product" : "Create New Product"}
        </h2>

        <div className="space-y-7">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              defaultValue={product?.title}
              required
              maxLength={100}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base 
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                       focus:outline-none transition-all"
              placeholder="Hand-forged iron candle holder"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              defaultValue={product?.category || ""}
              required
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base 
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                       focus:outline-none transition-all"
            >
              <option value="" disabled>Select a category</option>
              <option value="METALWORK">Metalwork</option>
              <option value="TEXTILE">Textile</option>
              <option value="WOODWORK">Woodwork</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={displayPrice}
              required
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base 
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                       focus:outline-none transition-all"
              placeholder="29.99"
            />
            <p className="text-xs text-gray-500 mt-2">Enter price in dollars (e.g., 29.99)</p>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description || ""}
              onChange={() => descriptionError && setDescriptionError("")}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base 
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                       focus:outline-none transition-all resize-none"
              placeholder="A brief overview for listings and search results..."
            />
            {descriptionError && (
              <p className="text-sm text-red-600 font-medium mt-2">{descriptionError}</p>
            )}
          </div>

          {/* Craft Story */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Craft Story <span className="text-blue-600 font-medium">(Recommended)</span>
            </label>
            <textarea
              name="craftStory"
              rows={8}
              defaultValue={product?.craftStory || ""}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base 
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                       focus:outline-none transition-all resize-none font-medium leading-relaxed"
              placeholder={`Share the story behind this piece...\n\n• What inspired you?\n• What materials did you use?\n• How long did it take to make?\n• Any special techniques?\n\nCustomers love knowing the journey!`}
            />
            <p className="text-xs text-gray-500 mt-2">
              This appears on your product page as "The Story Behind This Piece".
            </p>
          </div>

          {/* Main Image URL*/}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Main Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={images[0] || ""}
              onChange={(e) => setImages(e.target.value ? [e.target.value] : [])}
              placeholder="https://example.com/my-product.jpg"
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base 
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                       focus:outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">Direct link (Cloudinary, ImgBB, etc.)</p> 

           {/*images[0] && (
              <div className="mt-6">
                <img
                  src={images[0]}
                  alt="Preview"
                  className="w-full h-80 object-cover rounded-xl shadow-xl border-4 border-blue-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )*/}
            
          </div>
        </div>
        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 mt-8 text-center cursor-pointer 
        transition hover:border-blue-500 hover:bg-blue-50 
        ${isDragActive ? "border-blue-500 bg-blue-50" : ""}`} 
        {...getRootProps()}>
          <input {...getInputProps()} />
          {!preview ? (
            isDragActive ?
              <p className="text-gray-700">Drop the files here ...</p> :
              <p className="text-gray-700">Drag 'n' drop some files here, or click to select files</p>
          ) : (
            <div className="mt-6">
              {file?.type.startsWith('image/') ? (
                <img
                  src={preview}
                  alt="Preview"
                  width={400}
                  height={400}
                  className="mx-auto rounded-xl shadow-xl border-4 border-blue-200"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="mx-auto rounded-xl shadow-xl border-4 border-blue-200"
                />

              )}
              <p className="mt-4 text-gray-700">{file?.name}</p>
            </div>

          )} 
          </div>
          {
            file && !isUploading && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => startUpload([file])}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Upload File
                </button>
              </div>
            )
          }

        {isUploading && (
          <div className="mt-4">
            <p className="text-gray-700 mb-2">Uploading: {Math.round(progress * 100)}%</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${progress * 1}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="border-t mt-8 pt-6 flex justify-end">
          <h2 className="text-sm text-gray-600 mr-auto self-center">Uploaded Images: {images.length}</h2>
          <div className="flex space-x-2">
            {images.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Uploaded ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg border-2 border-gray-300"
              />
            ))}
            </div>
          </div>
          

        <div className="mt-12 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}

