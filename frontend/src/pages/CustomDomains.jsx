import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function CustomDomains() {
    const [domain, setDomain] = useState('');
    const [domainsList, setDomainsList] = useState([
        { id: 1, name: 'link.mycompany.com', status: 'verified', createdAt: '2026-06-15' }
    ]);

    const handleAddDomain = (e) => {
        e.preventDefault();
        if (!domain.trim()) return;
        setDomainsList([
            ...domainsList,
            { id: Date.now(), name: domain.trim(), status: 'pending_dns', createdAt: new Date().toISOString().split('T')[0] }
        ]);
        toast.success(`Domain ${domain} added! Please configure CNAME DNS records.`);
        setDomain('');
    };

    const [verifyingId, setVerifyingId] = useState(null);

    const handleVerifyDNS = (id, name) => {
        setVerifyingId(id);
        toast.loading(`Querying DNS records for ${name}...`, { id: 'dns-check' });

        setTimeout(() => {
            setDomainsList(prev => prev.map(item => {
                if (item.id === id) {
                    return { ...item, status: 'verified' };
                }
                return item;
            }));
            setVerifyingId(null);
            toast.success(`CNAME record verified! ${name} is now active.`, { id: 'dns-check' });
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">🌐 Custom Domains</h1>
                <p className="text-gray-500 text-sm">Brand your expirable URLs using your custom domain (e.g. link.yourbrand.com)</p>
            </div>

            {/* DNS Instructions Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-5 rounded-2xl text-white shadow-md space-y-3">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">⚙️</span>
                    <h3 className="font-bold text-base">How to Approve & Verify CNAME DNS Records</h3>
                </div>
                <p className="text-xs text-indigo-200 leading-relaxed">
                    To approve a pending domain, go to your DNS provider (Cloudflare, GoDaddy, Namecheap) and add a CNAME record pointing your subdomain to our platform server:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">Type</p>
                        <p className="font-mono text-sm font-semibold">CNAME</p>
                    </div>
                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">Host / Name</p>
                        <p className="font-mono text-sm font-semibold">links (or @)</p>
                    </div>
                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">Target Value</p>
                        <p className="font-mono text-sm font-semibold text-emerald-400">cname.expireo.com</p>
                    </div>
                </div>
            </div>

            {/* Add Domain Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect a New Domain</h2>
                <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="e.g. links.yourdomain.com"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
                    >
                        Connect Domain
                    </button>
                </form>
            </div>

            {/* Domain List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 font-semibold text-gray-900">
                    Connected Branded Domains
                </div>
                <div className="divide-y divide-gray-100">
                    {domainsList.map((d) => (
                        <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="font-semibold text-gray-900">{d.name}</p>
                                <p className="text-xs text-gray-400">Added on {d.createdAt}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {d.status === 'verified' ? (
                                    <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                                        ✓ Verified Active
                                    </span>
                                ) : (
                                    <>
                                        <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
                                            ⌛ Pending CNAME DNS
                                        </span>
                                        <button
                                            onClick={() => handleVerifyDNS(d.id, d.name)}
                                            disabled={verifyingId === d.id}
                                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                                        >
                                            {verifyingId === d.id ? 'Checking DNS...' : 'Verify DNS'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
