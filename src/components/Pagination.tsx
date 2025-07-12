// components/Pagination.jsx
import React from 'react';

const Pagination = ({
                        totalRecords,
                        recordsPerPage,
                        currentPage,
                        onPageChange,
                    }: {
    totalRecords: number;
    recordsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}) => {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i}>
                    <button
                        type="button"
                        onClick={() => handlePageChange(i)}
                        className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${
                            i === currentPage
                                ? 'bg-primary text-white dark:text-white-light dark:bg-primary'
                                : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
                        }`}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        return pages;
    };

    return (
        <ul className="flex items-center justify-center space-x-1 rtl:space-x-reverse m-auto my-4">
            {/* Prev Button */}
            <li>
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary disabled:opacity-50 disabled:pointer-events-none dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                >
                    &lt;
                </button>
            </li>

            {renderPageNumbers()}

            {/* Next Button */}
            <li>
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary disabled:opacity-50 disabled:pointer-events-none dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                >
                    &gt;
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
