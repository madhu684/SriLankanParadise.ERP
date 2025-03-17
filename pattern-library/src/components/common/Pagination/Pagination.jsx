import React from "react";
import "./Pagination.css";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  const maxPageNumbersToShow = 4;

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const startPage = Math.max(
    1,
    currentPage - Math.floor(maxPageNumbersToShow / 2)
  );
  const endPage = Math.min(
    startPage + maxPageNumbersToShow - 1,
    pageNumbers.length
  );

  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a onClick={() => paginate(currentPage - 1)} className="page-link">
            &laquo;
          </a>
        </li>
        {visiblePageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${number === currentPage ? "active" : ""}`}
          >
            <a onClick={() => paginate(number)} className="page-link">
              {number}
            </a>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === pageNumbers.length ? "disabled" : ""
          }`}
        >
          <a onClick={() => paginate(currentPage + 1)} className="page-link">
            &raquo;
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
