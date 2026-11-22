"use client";

export default function PriceSummary({
  items = [],
  country = "USA",
  countryRates = {},
  onSubmit,
  isSubmitting = false,
}) {
  const productsSubtotal = items.reduce((sum, item) => {
    const price = Number(item.unitPrice) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const selectedRate = countryRates[country] || { shipping: 0, taxPercent: 0 };
  const shippingCharge =
    items.length > 0 ? Number(selectedRate.shipping) || 0 : 0;
  const taxAmount =
    items.length > 0
      ? (productsSubtotal * (Number(selectedRate.taxPercent) || 0)) / 100
      : 0;

  const totalPrice = productsSubtotal + shippingCharge + taxAmount;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <h2 className="text-xl font-semibold text-stone-800">
          Live Quotation Summary
        </h2>
        <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
          {country}
        </span>
      </div>

      {/* Selected Products with Images */}
      <div className="space-y-3 border-b border-stone-100 py-4 text-sm">
        {items.length === 0 ? (
          <p className="text-stone-400">No products selected yet.</p>
        ) : (
          items.map((item, index) => {
            const qty = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            const lineTotal = qty * unitPrice;

            return (
              <div
                key={`${item.productId || item.productName}-${index}`}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || "/images/default-product.png"}
                    alt={item.productName || "Product"}
                    className="h-11 w-11 shrink-0 rounded-lg border border-stone-200 bg-stone-50 object-cover"
                  />
                  <div>
                    <p className="font-medium text-stone-800">
                      {item.productName || "Product"}
                    </p>
                    <p className="text-xs text-stone-500">
                      Qty: {qty} × ${unitPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <span className="font-semibold text-stone-800">
                  ${lineTotal.toFixed(2)}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Subtotal, Shipping & Tax */}
      <div className="space-y-2.5 border-b border-stone-100 py-4 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Products Subtotal</span>
          <span className="font-medium text-stone-800">
            ${productsSubtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-stone-600">
          <span>Shipping ({country})</span>
          <span className="font-medium text-stone-800">
            ${shippingCharge.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-stone-600">
          <span>Tax ({selectedRate.taxPercent || 0}%)</span>
          <span className="font-medium text-stone-800">
            ${taxAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Total Price */}
      <div className="my-5 flex items-center justify-between rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3.5">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-amber-900">
            Estimated Total
          </span>
          <span className="text-xs text-stone-500">Includes shipping & tax</span>
        </div>
        <span className="text-2xl font-bold text-stone-900">
          ${totalPrice.toFixed(2)}
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || items.length === 0}
        className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {isSubmitting ? "Sending Quotation..." : "Confirm & Send "}
      </button>
    </div>
  );
}