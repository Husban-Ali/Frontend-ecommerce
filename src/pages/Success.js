import React, { useEffect } from "react";
import SUCCESSIMAGE from "../assest/success.gif";
import { Link, useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyAndSaveOrder = async () => {
      try {
        if (!sessionId) {
          console.error("Session ID is missing from the URL.");
          return;
        }

        // Make an API call to verify payment and save the order
        const response = await fetch(
          `http://localhost:8080/api/verify-payment?session_id=${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (result.success) {
          console.log("Order saved successfully:", result.message);
        } else {
          console.error("Failed to verify payment:", result.message);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };

    verifyAndSaveOrder();
  }, [sessionId]);

  return (
    <div className="bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2 rounded">
      <img src={SUCCESSIMAGE} width={150} height={150} alt="Payment Success" />
      <p className="text-green-600 font-bold text-xl">Payment Successfully</p>
      <Link
        to={"/order"}
        className="p-2 px-3 mt-5 border-2 border-green-600 rounded font-semibold text-green-600 hover:bg-green-600 hover:text-white"
      >
        See Order
      </Link>
    </div>
  );
};

export default Success;
