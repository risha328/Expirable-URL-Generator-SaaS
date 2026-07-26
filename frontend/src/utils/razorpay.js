/**
 * Load Razorpay Standard Checkout script once.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay Checkout and resolve with payment response on success.
 */
export function openRazorpayCheckout(options) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay SDK failed to load"));
      return;
    }

    if (!options?.key) {
      reject(new Error("Missing Razorpay key"));
      return;
    }

    if (!options?.order_id && !options?.subscription_id) {
      reject(new Error("Missing Razorpay order_id / subscription_id"));
      return;
    }

    let settled = false;

    // Only pass defined fields — undefined subscription_id can break Standard Checkout
    const checkoutOptions = {
      key: options.key,
      name: options.name || "Expireo",
      description: options.description || "Expireo subscription",
      prefill: options.prefill || {},
      notes: options.notes || {},
      theme: options.theme || { color: "#4F46E5" },
      handler(response) {
        if (settled) return;
        settled = true;
        resolve(response);
      },
      modal: {
        ondismiss() {
          if (settled) return;
          settled = true;
          reject(new Error("PAYMENT_CANCELLED"));
        },
      },
    };

    if (options.image) checkoutOptions.image = options.image;

    if (options.subscription_id) {
      checkoutOptions.subscription_id = options.subscription_id;
    } else {
      checkoutOptions.order_id = options.order_id;
      // Amount/currency optional with order_id; include only when provided (must match order)
      if (options.amount != null) checkoutOptions.amount = Number(options.amount);
      if (options.currency) checkoutOptions.currency = options.currency;
    }

    const rzp = new window.Razorpay(checkoutOptions);

    rzp.on("payment.failed", (response) => {
      if (settled) return;
      settled = true;
      const msg =
        response?.error?.description ||
        response?.error?.reason ||
        "Payment failed";
      reject(new Error(msg));
    });

    try {
      rzp.open();
    } catch (err) {
      if (settled) return;
      settled = true;
      reject(err);
    }
  });
}
