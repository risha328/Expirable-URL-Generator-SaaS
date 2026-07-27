export const getLinkExpiryDate = (link) => link?.expiry || link?.expiresAt || null;

export const isLinkExpired = (link) => {
  if (!link) return false;
  if (link.status === 'expired') return true;
  const expiry = getLinkExpiryDate(link);
  if (!expiry) return false;
  return new Date(expiry) <= new Date();
};

export const getLinkExpiryStatus = (link) => {
  if (isLinkExpired(link)) return 'expired';
  const expiry = getLinkExpiryDate(link);
  if (!expiry) return 'no-expiry';

  const diffMs = new Date(expiry) - new Date();
  if (diffMs <= 24 * 60 * 60 * 1000) return 'expiring-soon';
  return 'active';
};

export const formatLinkExpiry = (link, formatter) => {
  if (link?.status === 'expired' && !getLinkExpiryDate(link)) {
    return 'Expired';
  }
  const expiry = getLinkExpiryDate(link);
  if (!expiry) return 'Never';
  return formatter ? formatter(expiry) : new Date(expiry).toLocaleString();
};
