import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

    const [startPage, setStartPage] = useState(1);

    useEffect(() => {
        if (currentPage < startPage) {
            setStartPage(currentPage);
        } else if (currentPage >= startPage + 3) {
            setStartPage(currentPage - 1);
        }
    }, [currentPage, startPage]);

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageChange = (page) => {
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const endPage = Math.min(startPage + 2, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded ${currentPage === i ? 'bg-[#4A3AFF] hover:bg-[#3D32CC] shadow-sm transition-all duration-200 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="flex flex-col md:flex-row gap-3 justify-center md:place-items-center">
            <div className="flex items-center gap-2 overflow-x-auto transition-all duration-500 ease-in-out">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`py-1 px-3 bg-gray-200 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ChevronLeft />
                </button>
                {renderPageNumbers()}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`py-1 px-3 bg-gray-200 rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
