import axios from '~/plugins/axios';
import { LIKECOIN_API, LIKECOIN_MISC_API_BASE } from '@/constant';

export const apiGetUserMinById = id => axios.get(`${LIKECOIN_API}/api/users/id/${id}/min`);

export const apiGetSocialListById = (id, type = '') => axios.get(`${LIKECOIN_API}/api/social/list/${id}?type=${type}`);

export const apiGetSuperLikeInfo = id => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/share/${id}`);

export const apiGetLikeButtonMyStatus = (id, referrer, isCookieSupport, documentReferrer = '', sessionID = '') => {
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.get(
    `${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/self?referrer=${encodeURIComponent(referrer)}${cookieParam}&show_count=0`,
    {
      headers: {
        'Document-Referrer': documentReferrer,
        'X-Likecoin-Session-ID': sessionID,
      },
      withCredentials: true,
    },
  );
};

export const apiGetLikeButtonSelfCount = (id, referrer) => axios.get(
  `${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/self/like?referrer=${encodeURIComponent(referrer)}`,
  { withCredentials: true },
);

export const apiGetSuperLikeMyStatus = (tz = '', referrer = '') => axios.get(
  `${LIKECOIN_MISC_API_BASE}/api/like/share/self?tz=${tz}&referrer=${encodeURIComponent(referrer)}`,
  { withCredentials: true },
);

export const apiGetLikeButtonTotalCount = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/total?referrer=${encodeURIComponent(referrer)}`);

export const apiGetLikeButtonLikerList = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/list?referrer=${encodeURIComponent(referrer)}`);

export const apiPostLikeLink = (id, referrer, payload, documentReferrer = '', sessionID = '') => axios.post(
  `${LIKECOIN_MISC_API_BASE}/api/like/likelink/${id}?referrer=${encodeURIComponent(referrer)}`,
  payload,
  {
    headers: {
      'Document-Referrer': documentReferrer,
      'X-Likecoin-Session-ID': sessionID,
    },
    withCredentials: true,
  },
);

export const apiPostLikeButton = (id, referrer, count = 1, isCookieSupport, documentReferrer = '', sessionID = '') => {
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.post(
    `${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/${count}?referrer=${encodeURIComponent(referrer)}${cookieParam}`,
    {},
    {
      headers: {
        'Document-Referrer': documentReferrer,
        'X-Likecoin-Session-ID': sessionID,
      },
      withCredentials: true,
    },
  );
};
export const apiPostLikeButtonReadEvent = (id, referrer, isCookieSupport, documentReferrer = '', sessionID = '') => {
  const cookieParam = isCookieSupport !== undefined ? `&cookie_support=${isCookieSupport ? 1 : 0}` : '';
  return axios.post(
    `${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/read?referrer=${encodeURIComponent(referrer)}${cookieParam}`,
    {},
    {
      headers: {
        'Document-Referrer': documentReferrer,
        'X-Likecoin-Session-ID': sessionID,
      },
      withCredentials: true,
    },
  );
};

export const apiPostSuperLike = (id, referrer, tz, parentSuperLikeID, documentReferrer = '', sessionID = '') => axios.post(
  `${LIKECOIN_MISC_API_BASE}/api/like/share/${id}`,
  {
    referrer,
    tz,
    parentSuperLikeID,
  },
  {
    headers: {
      'Document-Referrer': documentReferrer,
      'X-Likecoin-Session-ID': sessionID,
    },
    withCredentials: true,
  },
);

export const apiQueryCoinGeckoInfo = () => axios.get('https://api.coingecko.com/api/v3/coins/likecoin?localization=false', { withCredentials: false });

export const apiGetPageTitle = url => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/like/suggest/info/?url=${encodeURIComponent(url)}`)
  .then(res => (res.data || {}).title || '')
  .catch(() => '');
