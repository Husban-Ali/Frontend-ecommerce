import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to handle async fetch
  const [error, setError] = useState(null); // State to handle any errors

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(SummaryApi.getOrder.url, {
        method: SummaryApi.getOrder.method,
        credentials: "include",
      });

      const responseData = await response.json();

      if (responseData?.data) {
        setData(responseData.data);
      } else {
        setData([]); // If no data in response, set as empty array
      }
      console.log("Order list:", responseData); // Log the response data to check the structure
    } catch (error) {
      setError("Failed to fetch order details"); // Handle the error
      console.error("Failed to fetch order details", error);
    } finally {
      setLoading(false); // Set loading to false after the data has been fetched
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>; // Show loading message while fetching data
  }

  if (error) {
    return <p>{error}</p>; // Show error message if fetching fails
  }

  if (data.length === 0) {
    return <p>No orders available</p>; // Show no orders message if no data is available
  }

  return (
    <div>
      <div className="p-4 w-full">
        {data.map((item, index) => {
          // Ensure that item.productDetails and item.paymentDetails are valid before rendering
          if (!item.productDetails || !item.paymentDetails) {
            console.warn(
              `Missing productDetails or paymentDetails for item ${index}`
            );
            return <p key={index}>Missing data for this order</p>;
          }

          return (
            <div key={item.userId + index}>
              <p className="font-medium text-lg">
                {moment(item.createdAt).format("LL")}
              </p>
              <div className="border rounded">
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="grid gap-1">
                    {item.productDetails?.map((product, index) => (
                      <div
                        key={product.productId + index}
                        className="flex gap-3 bg-slate-100"
                      >
                        <img
                          // Safely access product.image[0] with optional chaining
                          src={product?.image?.[0] || "default-image.jpg"} // Provide a fallback image if undefined
                          className="w-28 h-28 bg-slate-200 object-scale-down p-2"
                          alt="product image"
                        />
                        <div>
                          <div className="font-medium text-lg text-ellipsis line-clamp-1">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-5 mt-1">
                            <div className="text-lg text-red-500">
                              {displayINRCurrency(product.price)}
                            </div>
                            <p>Quantity : {product.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 p-2 min-w-[300px]">
                    <div>
                      <div className="text-lg font-medium">
                        Payment Details :{" "}
                      </div>
                      {/* Safely access payment_method_type[0] */}
                      <p className="ml-1">
                        Payment method :{" "}
                        {item.paymentDetails?.payment_method_type?.[0] || "N/A"}{" "}
                        {/* Fallback to "N/A" if undefined */}
                      </p>
                      <p className="ml-1">
                        Payment Status :{" "}
                        {item.paymentDetails?.payment_status || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <div className="text-lg font-medium">
                        Shipping Details :
                      </div>
                      {item.shipping_options?.map((shipping, index) => (
                        <div key={shipping.shipping_rate} className="ml-1">
                          Shipping Amount : {shipping.shipping_amount}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="font-semibold ml-auto w-fit lg:text-lg">
                  Total Amount : {item.totalAmount}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderPage;
