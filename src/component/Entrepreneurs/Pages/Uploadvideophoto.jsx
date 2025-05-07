import { FileInput, Label } from 'flowbite-react'
import { CloudUpload } from 'lucide-react'
import React, { useState } from 'react'

const Uploadvideophoto = () => {

    const [selectedImages, setSelectedImages] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to an array
        const imageUrls = files.map((file) => URL.createObjectURL(file)); 
        setSelectedImages((prevImages) => [...prevImages, ...imageUrls]); 
    };



    return (
        <>
            <div className="bg-white rounded-xl p-5">
                <h1 className='text-3xl font-semibold text-[#05004E]'>Uploaded Photo and Video</h1>
                <div className="grid grid-cols-4 mt-5 gap-5">
                    <label
                        htmlFor="dropzone-file"
                        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            <div className="text-blue-500">
                                <CloudUpload />
                            </div>
                            <p className="mb-2 text-sm text-blue-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, or GIF (MAX. 800x400px)</p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange} // Call the file change handler
                        />
                    </label>
                    {selectedImages.map((imageUrl, index) => (
                        <img
                            key={index} // Add a unique key for each image
                            src={imageUrl}
                            alt="Uploaded preview"
                            className="h-64 w-full  rounded-lg"
                        />
                    ))}
                </div>
            </div>

        </>
    )
}

export default Uploadvideophoto