import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay';

export default function Billing() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [retryingId, setRetryingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/payments/billing');
      setSummary(data);
      setGstin(data.user?.gstin || '');
      setBusinessName(data.user?.businessName || '');
      setBillingAddress(data.user?.billingAddress || '');
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load billing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveBillingProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/payments/billing-profile', {
        gstin,
        businessName,
        billingAddress,
      });
      toast.success('Billing profile saved');
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSavingProfile(false);
    }
  };

  const cancelSubscription = async (atCycleEnd) => {
    if (!window.confirm(atCycleEnd
      ? 'Cancel at end of billing period? You keep access until then.'
      : 'Cancel immediately? You will lose Pro features now.')) {
      return;
    }
    setCancelling(true);
    try {
      const { data } = await api.post('/payments/cancel-subscription', {
        cancelAtCycleEnd: atCycleEnd,
      });
      toast.success(data.message);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    } finally {
      setCancelling(false);
    }
  };

  const downloadInvoice = async (id, invoiceNumber) => {
    try {
      const res = await api.get(`/payments/invoice/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber || 'invoice'}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Could not download invoice');
    }
  };

  const retryPayment = async (paymentId, plan, billingCycle) => {
    setRetryingId(paymentId);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Unable to load Razorpay');
        return;
      }

      const { data: order } = await api.post('/payments/retry', { paymentId });
      if (!order?.keyId || (!order?.orderId && !order?.subscriptionId)) {
        throw new Error(order?.message || 'Failed to create retry checkout');
      }

      const isSubscription = order.mode === 'subscription' && order.subscriptionId;
      const paymentResponse = await openRazorpayCheckout({
        key: order.keyId,
        name: 'Expireo',
        description: `Retry ${plan} (${billingCycle})`,
        prefill: order.prefill,
        theme: { color: '#4F46E5' },
        ...(isSubscription
          ? { subscription_id: order.subscriptionId }
          : {
              order_id: order.orderId,
              amount: Number(order.amount),
              currency: order.currency || 'INR',
            }),
      });

      const { data: verified } = await api.post('/payments/verify', isSubscription
        ? {
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_subscription_id: paymentResponse.razorpay_subscription_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          }
        : {
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          });

      if (verified.user) {
        localStorage.setItem('user', JSON.stringify(verified.user));
        setUser(verified.user);
      }
      toast.success('Payment successful');
      await load();
    } catch (err) {
      if (err?.message === 'PAYMENT_CANCELLED') {
        toast.error('Payment cancelled');
      } else {
        toast.error(err?.response?.data?.message || err.message || 'Retry failed');
      }
    } finally {
      setRetryingId(null);
    }
  };

  const formatAmount = (paise) => `₹${((paise || 0) / 100).toFixed(2)}`;
  const formatDate = (d) => (d ? new Date(d).toLocaleString() : '—');

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">Loading billing…</div>
    );
  }

  const u = summary?.user || user;
  const payments = summary?.payments || [];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage plan, invoices, GST details, and failed payments</p>
        </div>
        <Link
          to="/pricing"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          Change plan
        </Link>
      </div>

      {/* Current plan */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Current plan</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">{u?.subscriptionPlan || 'Free'}</p>
            <p className="text-sm text-gray-500 capitalize">
              Status: {u?.subscriptionStatus || 'free'}
              {u?.billingCycle ? ` · ${u.billingCycle}` : ''}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Expires: {formatDate(u?.subscriptionExpiresAt)}
            </p>
            {u?.razorpaySubscriptionId && (
              <p className="text-xs text-gray-400 mt-1 font-mono">Sub: {u.razorpaySubscriptionId}</p>
            )}
          </div>
          {u?.isSubscribed && u?.razorpaySubscriptionId && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => cancelSubscription(true)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel at period end
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={() => cancelSubscription(false)}
                className="px-3 py-2 text-sm rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50"
              >
                Cancel now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GST / billing profile */}
      <form onSubmit={saveBillingProfile} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-900">GST & invoice details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Business name</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Acme Pvt Ltd"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">GSTIN</label>
            <input
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-mono"
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Billing address</label>
            <textarea
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Street, city, state, PIN"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={savingProfile}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black disabled:opacity-50"
        >
          {savingProfile ? 'Saving…' : 'Save billing details'}
        </button>
      </form>

      {/* Failed / retry */}
      {summary?.failedPayments?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-amber-900 mb-2">Failed payments</h2>
          <p className="text-sm text-amber-800 mb-3">Retry to restore or start your subscription.</p>
          <div className="space-y-2">
            {summary.failedPayments.map((p) => (
              <div key={p._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white rounded-xl p-3 border border-amber-100">
                <div className="text-sm">
                  <span className="font-semibold">{p.plan}</span> · {p.billingCycle} · {formatAmount(p.amount)}
                  <p className="text-xs text-gray-500">{p.failureReason || 'Payment failed'}</p>
                </div>
                <button
                  type="button"
                  disabled={retryingId === p._id}
                  onClick={() => retryPayment(p._id, p.plan, p.billingCycle)}
                  className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {retryingId === p._id ? 'Opening…' : 'Retry payment'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Payment history</h2>
        </div>
        {payments.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Plan</th>
                  <th className="px-5 py-3 font-semibold">Mode</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/80">
                    <td className="px-5 py-3 whitespace-nowrap">{formatDate(p.paidAt || p.createdAt)}</td>
                    <td className="px-5 py-3">
                      {p.plan}
                      {p.promoCode && (
                        <span className="ml-1 text-xs text-emerald-600">({p.promoCode})</span>
                      )}
                    </td>
                    <td className="px-5 py-3 capitalize">{p.mode || 'order'}</td>
                    <td className="px-5 py-3">{formatAmount(p.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.status === 'paid' || p.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : p.status === 'failed'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {(p.status === 'paid' || p.status === 'active') ? (
                        <button
                          type="button"
                          onClick={() => downloadInvoice(p._id, p.invoiceNumber)}
                          className="text-indigo-600 hover:underline text-xs font-semibold"
                        >
                          PDF
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
