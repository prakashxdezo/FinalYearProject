import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse products, add to cart, and proceed to checkout. You can pay via Khalti or Cash on Delivery.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept Khalti digital wallet and Cash on Delivery (COD).",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery typically takes 3-5 business days within Kathmandu and 5-7 days for other areas.",
  },
  {
    q: "Can I return a product?",
    a: "Yes, you can return products within 7 days of delivery if they are unused and in original condition.",
  },
  {
    q: "How do I track my order?",
    a: "You can track your order from My Account → Orders section.",
  },
  {
    q: "How do I become a seller?",
    a: "Click on 'Become a Seller' and fill in your business details to register as a seller.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes, all payments are processed securely through Khalti's encrypted payment gateway.",
  },
  {
    q: "Can I cancel my order?",
    a: "You can cancel your order before it is shipped from the My Orders section.",
  },
];

const FAQ = () => {
  return (
    <div className="lg:px-52 px-5 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h1>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
