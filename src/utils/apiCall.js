import { BE_API_URL } from "../constants/homePage";

export const fetchAllCampaigners = async () => {
    try {
      const response = await fetch(`${BE_API_URL}/showcampaigns`);
      const data = await response.json();
      return data?.campaignDetails || []; ;
    } catch (error) {
      return []
    }
  };

export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};
