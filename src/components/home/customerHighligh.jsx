import React from "react";

const CustomerHighlight = () => {
  return (
    <div className="flex flex-row items-center gap-4  self-start mt-[44px]">
      <div className="flex -space-x-4">
        <img
          src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Customer 1"
          className="customer_img"
        />
        <img
          src="https://plus.unsplash.com/premium_photo-1693000696693-26aa43e8b97e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Customer 2"
          className="customer_img"
        />
        <img
          src="https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1398&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Customer 3"
          className="customer_img"
        />
        <img
          src="https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Customer 4"
          className="customer_img"
        />
        <img
          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Customer 5"
          className="customer_img"
        />
      </div>
      <div>
        <p className=" text-sm text-white ">
          <span className="font-bold text-secondary ">50,000+</span>
          <span className="text-white opacity-50 text-[16px]">
            {" "}
            devices delivered last year
          </span>
        </p>
      </div>
    </div>
  );
};

export default CustomerHighlight;
