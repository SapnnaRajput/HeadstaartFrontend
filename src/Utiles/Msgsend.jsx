import { Camera, Send, Trash2 } from 'lucide-react';
import React from 'react'
import { MdAttachFile } from 'react-icons/md';
import { notify } from './Notification';

const Msgsend = ({ setMsg, msg, file, setFile, imageFile, sendMsg, setImageFile }) => {

    const handleTextChange = (e) => {
        setMsg(e.target.value);

        // const maxCols = 30;
        // const words = newText.split(' '); // Split text into words
        // let currentLine = '';
        // let lines = [];

        // // Iterate through words and break them into lines based on maxCols
        // words.forEach((word) => {
        //     if (currentLine.length + word.length + 1 <= maxCols) {
        //         // Add the word to the current line (with a space)
        //         currentLine += (currentLine.length > 0 ? ' ' : '') + word;
        //     } else {
        //         // If the word doesn't fit, push the current line and start a new line with the word
        //         lines.push(currentLine);
        //         currentLine = word;
        //     }
        // });

        // // Push any remaining content in the last line
        // if (currentLine.length > 0) {
        //     lines.push(currentLine);
        // }

        // // Join all lines with newlines
        // setMsg(lines.join('\n'));
    };


    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                // alert('File selected: ' + selectedFile.name);
            } else {
                notify('danger', 'Invalid file type. Please select a valid document.');
                // alert('Invalid file type. Please select a valid document.');
                setFile(null); // Clear state if the file type is not valid
            }
        }
    };

    const handleDeleteFile = () => {
        setFile(null); // Reset the file state
        document.getElementById("upload22").value = "";
    };


    const handleImageUpload = (event) => {

        const file = event.target.files[0];
        if (file) {

            const allowedTypes = ['image/png', 'image/jpeg'];
            if (!allowedTypes.includes(file.type)) {
                notify('error', 'Please upload a PNG, JPEG, or JPG file.');
                return;
            }
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                notify('error', 'File size should not exceed 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setImageFile({
                    file: file,
                    new_img: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = () => {
        setImageFile({
            file: '',
            new_img: ''
        });
    };


    return (
        <>
            <div className="flex flex-row relative justify-between gap-3 px-1 py-1.5 rounded-lg shadoww  place-items-start h-full mt-24">
                <div className="absolute -top-20">
                    {imageFile?.new_img &&
                        <div className="relative w-24  h-24  aspect-square ms-1.5">
                            <img src={imageFile?.new_img} alt="" className='h-full w-full rounded-lg object-cover aspect-square' />
                            <div className="absolute -top-0 mt-2 right-2">
                                <button onClick={handleDeleteImage} className='bg-white p-1 rounded-full'><Trash2 size={17} /></button>
                            </div>
                        </div>
                    }
                    {file &&
                        <div className="w-64 overflow-hidden flex flex-row gap-2 text-sm p-1 border rounded-lg place-items-start bg-white">
                            <div className="flex flex-col w-52 overflow-hidden">
                                <span className='text-xs font-medium pe-10'>{file?.name}</span>
                                <span className='text-[10px] font-medium pe-10'>{formatFileSize(file?.size)}</span>
                            </div>
                            <button onClick={handleDeleteFile} className='bg-white p-1 rounded-full'><Trash2 size={20} /></button>
                        </div>
                    }
                </div>
                <div className="flex flex-row justify-between mt-auto w-full">
                    <textarea rows={2} cols={90} type="text" className='resize-none scroll focus:ring-0 border-0  text-sm' placeholder='Type Here' onChange={handleTextChange} value={msg}></textarea>
                    <div className="flex flex-row pe-2 gap-5 place-items-center ml-auto">
                        {!file &&
                            <label htmlFor='upload' className=' cursor-pointer transition-all duration-300 ease-out hover:scale-105'>
                                <Camera />
                                <input onChange={handleImageUpload} type="file" name="" id="upload" className='hidden' />
                            </label>
                        }
                        {!imageFile.file &&
                            <label htmlFor='upload22' className='text-2xl cursor-pointer transition-all duration-300 ease-out hover:scale-105'>
                                <MdAttachFile />
                                <input type="file" onChange={handleFileChange} name="upload22" id="upload22" className='hidden' />
                            </label>
                        }
                        <button onClick={sendMsg} className='w-10 h-10 transition-all duration-300 ease-out hover:scale-105 text-white bg-[#4A3AFF]  hover:bg-[#3D32CC] rounded-full flex justify-center place-items-center aspect-square'><Send /></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Msgsend