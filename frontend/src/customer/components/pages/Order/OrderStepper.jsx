import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const steps = [
  {
    name: "Order Placed",
    description: "Your order has been placed",
    value: "PLACED",
  },
  {
    name: "Confirmed",
    description: "Item packed in dispatch warehouse",
    value: "CONFIRMED",
  },
  {
    name: "Shipped",
    description: "Your order is on its way",
    value: "SHIPPED",
  },
  {
    name: "Delivered",
    description: "Order delivered successfully",
    value: "DELIVERED",
  },
];

const cancelSteps = [
  {
    name: "Order Placed",
    description: "Your order was placed",
    value: "PLACED",
  },
  {
    name: "Order Cancelled",
    description: "Your order has been cancelled",
    value: "CANCELLED",
  },
];

// Map each status to its step index for progress tracking
const statusIndex = {
  PENDING: -1,
  PLACED: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: 1, // for cancel steps
};

const OrderStepper = ({ orderStatus }) => {
  const [statusStep, setStatusStep] = useState(steps);

  useEffect(() => {
    if (orderStatus === "CANCELLED") {
      setStatusStep(cancelSteps);
    } else {
      setStatusStep(steps);
    }
  }, [orderStatus]);

  const currentIndex =
    orderStatus === "CANCELLED"
      ? 1 // last step in cancelSteps
      : (statusIndex[orderStatus] ?? -1);

  return (
    <Box className="mx-auto my-4">
      {statusStep.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isCancelled =
          orderStatus === "CANCELLED" && step.value === "CANCELLED";

        return (
          <div key={index} className="flex px-4">
            <div className="flex flex-col items-center">
              <Box
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    isCurrent && isCancelled
                      ? "bg-red-100 text-red-500"
                      : isCurrent || isCompleted
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-200 text-gray-400"
                  }`}
              >
                {isCurrent || isCompleted ? (
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                ) : (
                  <FiberManualRecordIcon sx={{ fontSize: 12 }} />
                )}
              </Box>

              {index < statusStep.length - 1 && (
                <div
                  className={`h-16 w-[2px] ${
                    isCompleted || isCurrent ? "bg-emerald-400" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>

            <div className="ml-3 w-full pb-2">
              <div
                className={`p-2 rounded-md -translate-y-2 ${
                  isCurrent && isCancelled
                    ? "bg-red-500 text-white"
                    : isCurrent
                      ? "bg-emerald-600 text-white"
                      : ""
                }`}
              >
                <p
                  className={`font-medium text-sm ${isCurrent ? "text-white" : "text-gray-700"}`}
                >
                  {step.name}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    isCurrent ? "text-gray-200" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </Box>
  );
};

export default OrderStepper;
