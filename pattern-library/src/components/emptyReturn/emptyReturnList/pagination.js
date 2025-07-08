const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  // Calculate total pages based on the number of items
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="pagination">
      {/* Previous Button */}
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1} // Disable if we're on the first page
      >
        Previous
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => paginate(index + 1)} // Page number starts from 1
          className={currentPage === index + 1 ? "active" : ""}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages} // Disable if we're on the last page
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
