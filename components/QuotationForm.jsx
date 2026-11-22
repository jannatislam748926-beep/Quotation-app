"use client";

export default function QuotationForm({
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  country,
  setCountry,
  countries = ["UK", "USA", "China"],
  products = [],
  selectedItems = [],
  onAddItem,
  onItemChange,
  onRemoveItem,
  onSubmit,
  errorMessage = "",
  successMessage = "",
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7"
    >
      {/* Form Header */}
      <div className="border-b border-stone-100 pb-4">
        <h2 className="text-xl font-semibold text-stone-800">
          Customer & Order Details
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          Enter your contact information, destination country, and product quantities.
        </p>
      </div>

      {/* Customer Name & Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Ayesha Rahman"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/70 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="e.g. name@example.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/70 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      {/* Purchasing Country */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600">
          Purchasing Country *
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-stone-50/70 px-3.5 py-2.5 text-sm font-medium text-stone-800 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Products & Quantities */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-stone-600">
            Products & Quantities *
          </label>
          <button
            type="button"
            onClick={onAddItem}
            className="rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
          >
            + Add Product
          </button>
        </div>

        <div className="space-y-3">
          {selectedItems.map((item, index) => {
            const matchedProduct = products.find((p) => p.id === item.productId);
            const imgSrc =
              item.image || matchedProduct?.image || "/images/default-product.png";

            return (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 transition hover:border-amber-200 sm:flex-row sm:items-center"
              >
                {/* Product Image */}
                <img
                  src={imgSrc}
                  alt={item.productName || "Product"}
                  className="h-16 w-16 shrink-0 rounded-xl border border-stone-200 bg-white object-cover"
                />

                {/* Product Dropdown */}
                <div className="flex-1">
                  <span className="mb-1 block text-[11px] font-medium text-stone-500">
                    Product
                  </span>
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      onItemChange(index, "productId", e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} (${prod.unitPrice})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Input */}
                <div className="w-full sm:w-24">
                  <span className="mb-1 block text-[11px] font-medium text-stone-500">
                    Qty
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) =>
                      onItemChange(index, "quantity", Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* Remove Button */}
                {selectedItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(index)}
                    className="self-end rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 sm:self-end"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      )}
    </form>
  );
}