"use client";

import { useState } from "react";
import QuotationForm from "../components/QuotationForm";
import PriceSummary from "../components/PriceSummary";
import { products, countries, countryRates } from "../data/products";
import { submitQuotation } from "../services/quoteService";

const createInitialItem = () => {
  const firstProduct = products[0] || {
    id: "",
    name: "",
    unitPrice: 0,
    image: "/images/default-product.png",
  };

  return {
    productId: firstProduct.id,
    productName: firstProduct.name,
    unitPrice: firstProduct.unitPrice,
    image: firstProduct.image,
    quantity: 1,
  };
};

export default function HomePage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [country, setCountry] = useState(countries[1] || "USA");
  const [selectedItems, setSelectedItems] = useState([createInitialItem()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddItem = () => {
    setSelectedItems((prev) => [...prev, createInitialItem()]);
  };

  const handleRemoveItem = (indexToRemove) => {
    setSelectedItems((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove)
    );
  };

  const handleItemChange = (index, field, value) => {
    setSelectedItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;

        if (field === "productId") {
          const found = products.find((p) => p.id === value);
          return {
            ...item,
            productId: value,
            productName: found ? found.name : item.productName,
            unitPrice: found ? Number(found.unitPrice) : item.unitPrice,
            image: found ? found.image : "/images/default-product.png",
          };
        }

        if (field === "quantity") {
          const parsedQty = Number(value);
          return {
            ...item,
            quantity: parsedQty < 1 || Number.isNaN(parsedQty) ? 1 : parsedQty,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setErrorMessage("");
    setSuccessMessage("");

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMessage("Please enter both your full name and email address.");
      return;
    }

    const productsSubtotal = selectedItems.reduce(
      (sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
      0
    );

    const rate = countryRates[country] || { shipping: 0, taxPercent: 0 };
    const shippingCharge = Number(rate.shipping) || 0;
    const taxAmount = (productsSubtotal * (Number(rate.taxPercent) || 0)) / 100;
    const totalPrice = productsSubtotal + shippingCharge + taxAmount;

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        country,
        items: selectedItems,
        pricing: {
          productsSubtotal,
          shippingCharge,
          taxPercent: rate.taxPercent || 0,
          taxAmount,
          totalPrice,
        },
      };

      const result = await submitQuotation(payload);
      setSuccessMessage(
        result.message || "Quotation submitted and confirmation email sent!"
      );
    } catch (error) {
      setErrorMessage(
        error.message || "Something went wrong while sending the quotation."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-100/80 px-4 py-10 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Top Heading */}
        <div className="mb-8 text-center sm:text-left">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            Instant Quotation App
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Instant Quotation Request
          </h1>
          <p className="mt-1.5 text-sm text-stone-600">
            Select products, quantity, and country (UK, USA, China) to calculate price instantly.
          </p>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <QuotationForm
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerEmail={customerEmail}
              setCustomerEmail={setCustomerEmail}
              country={country}
              setCountry={setCountry}
              countries={countries}
              products={products}
              selectedItems={selectedItems}
              onAddItem={handleAddItem}
              onItemChange={handleItemChange}
              onRemoveItem={handleRemoveItem}
              onSubmit={handleSubmit}
              errorMessage={errorMessage}
              successMessage={successMessage}
            />
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <PriceSummary
              items={selectedItems}
              country={country}
              countryRates={countryRates}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </main>
  );
}