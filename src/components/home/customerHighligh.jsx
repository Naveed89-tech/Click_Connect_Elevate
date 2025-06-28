const CustomerHighlight = () => {
  return (
    <div className="flex flex-row items-center gap-4  self-start mt-[44px]">
      <div className="flex -space-x-4">
        <img
          src="https://raw.githubusercontent.com/Naveed89-tech/Click-Connect-Images/refs/heads/main/customer/1.avif"
          alt="Customer 1"
          className="customer_img"
        />
        <img
          src="https://raw.githubusercontent.com/Naveed89-tech/Click-Connect-Images/refs/heads/main/customer/2.avif"
          alt="Customer 2"
          className="customer_img"
        />
        <img
          src="https://raw.githubusercontent.com/Naveed89-tech/Click-Connect-Images/refs/heads/main/customer/3.avif"
          alt="Customer 3"
          className="customer_img"
        />
        <img
          src="https://raw.githubusercontent.com/Naveed89-tech/Click-Connect-Images/refs/heads/main/customer/4.avif"
          alt="Customer 4"
          className="customer_img"
        />
        <img
          src="https://raw.githubusercontent.com/Naveed89-tech/Click-Connect-Images/refs/heads/main/customer/5.avif"
          alt="Customer 5"
          className="customer_img"
        />
      </div>
      <div>
        <p className=" text-sm text-white ">
          <span className="font-bold text-secondary ">5,000+</span>
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
