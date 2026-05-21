

export const themeColor = "#EF4F5F"
export const IskconFontColor = "#FFFFFF"             // '#ffffff'
export const IskconBgColor = "rgb(12 10 32)"               // '#54956e'
export const IskconProgressColor = "#d582f0" //"#f4c430"         // '#e3c44e'
export const IskconGradientLight = 'linear(to-r, #d582f0, #d582f0)' //'linear(to-r, #f4c430, #f4c430)'         // 'linear(to-r, teal.500, green.500)'
export const IskconGradientDark = 'linear(to-r,  #0277de, rgb(144, 181, 232))'         // 'linear(to-r, teal.200, green.200)'


export const formatCurrency = (amount, currencySymbol = '₹') => {
    if (amount == null || isNaN(Number(amount))) return `${currencySymbol}0`; // Handle undefined/null cases
    return `${currencySymbol}${Number(amount).toLocaleString('en-IN')}`;
  };

export const formatTimeAgo = (date) => {
    const now = new Date();
    const donationDate = new Date(date);
    const diffInSeconds = Math.floor((now - donationDate) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return `${diffInMinutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const diffInHours = Math.floor(diffInSeconds / 3600);
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInSeconds / 86400);
      return `${diffInDays} days ago`;
    }
  };

export function getDaysDifference( endDate) {
    const start = new Date();
   
    const end = new Date(endDate);
  
    const diffInMilliseconds = end - start;
  
   
    const days = diffInMilliseconds / (1000 * 60 * 60 * 24);
  
   
    return Math.floor(days);
  }

export function calculatePercentage(totalAmount, raisedAmount) {
    if (totalAmount === 0) {
      return 0; 
    }
    
    const percentage = (raisedAmount / totalAmount) * 100;
    return percentage.toFixed(2);
  }
