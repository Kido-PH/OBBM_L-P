import React, { useState, useEffect } from "react";

const ContractContent = ({ contractData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxHeight = 600; // Giới hạn chiều cao cho mỗi phần

  const splitContentByPage = (content) => {
    const pages = [];
    let currentPageContent = [];
    let currentHeight = 0;

    content.forEach((item, index) => {
      const itemHeight = 50; // Giả sử mỗi đoạn có chiều cao cố định (có thể tính toán tùy theo nội dung thực tế)
      if (currentHeight + itemHeight > maxHeight) {
        pages.push(currentPageContent);
        currentPageContent = [];
        currentHeight = 0;
      }
      currentPageContent.push(item);
      currentHeight += itemHeight;
    });
    if (currentPageContent.length) {
      pages.push(currentPageContent); // Thêm phần cuối cùng nếu còn nội dung
    }
    return pages;
  };

  const contractContent = [
    <h2 key="1" style={{ textAlign: "center", textTransform: "uppercase" }}>
      Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam
    </h2>,
    <p key="2" style={{ textAlign: "center", fontWeight: "bold" }}>
      Độc lập - Tự do - Hạnh phúc
    </p>,
    <h3 key="3" style={{ textAlign: "center", marginTop: "20px" }}>
      Hợp Đồng Dịch Vụ
    </h3>,
    <p key="4" style={{ textAlign: "right" }}>
      Số hợp đồng:{" "}
      <strong>{contractData.contractId || "..."}</strong>
    </p>,
    // Thêm các phần nội dung hợp đồng tiếp theo
  ];

  const pages = splitContentByPage(contractContent);

  useEffect(() => {
    window.scrollTo(0, 0); // Khi chuyển trang, cuộn lên đầu trang
  }, [currentPage]);

  return (
    <div>
      <div id="contract-content">
        {pages[currentPage - 1]}
      </div>
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>
            Previous Page
          </button>
        )}
        {currentPage < pages.length && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>
            Next Page
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractContent;
