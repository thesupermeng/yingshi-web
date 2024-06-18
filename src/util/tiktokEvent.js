import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';



export function  handleCompletePaymentAha (res) {
  const { userInfo } = useYingshiUser()

  const purchaseData = {
    email: userInfo?.user_email, // Replace with actual data
    phoneNumber: userInfo?.user_phone, // Replace with actual data
    uniqueID: userInfo?.user_id, // Replace with actual data
    topupPrice: res?.value, // Replace with actual data
    currency: res?.currency, // example currency, adjust as needed
    content_type: 'topup', // Adjust as necessary
  };
  if (typeof window.ttq === 'undefined') {
    console.error('TikTok Pixel is not loaded');
    return;
  }

  const hashedEmail = purchaseData.email ? CryptoJS.SHA256(purchaseData.email).toString(CryptoJS.enc.Hex) : '';
  const hashedPhoneNumber = (purchaseData.phoneNumber && purchaseData.phoneNumber !== '0')
    ? CryptoJS.SHA256(purchaseData.phoneNumber).toString(CryptoJS.enc.Hex)
    : '';
  const hashedExternalID = purchaseData.uniqueID ? CryptoJS.SHA256(purchaseData.uniqueID).toString(CryptoJS.enc.Hex) : '';

  const identifyPayload = {};
  if (hashedEmail) identifyPayload.email = hashedEmail;
  if (hashedPhoneNumber) identifyPayload.phone_number = hashedPhoneNumber;
  if (hashedExternalID) identifyPayload.external_id = hashedExternalID;

  // Identify the user
  if (Object.keys(identifyPayload).length > 0) {
    console.log('Identifying user with:', identifyPayload); // Debug log
    window.ttq.identify(identifyPayload);
  }

  // Ensure productPrice is a valid number
  const topupPrice = parseFloat(purchaseData.topupPrice);
  if (isNaN(topupPrice) || topupPrice < 0) {
    console.error('Invalid product price:', purchaseData.topupPrice);
    return;
  }

  // Track the CompletePayment event
  console.log('Tracking CompletePayment with:', {
    purchaseData
  }); // Debug log


    // Ensure the TikTok pixel library is loaded
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('CompletePaymentAha', {
        purchaseData
      });
    } else {
      console.error('TikTok pixel is not initialized or ttq.track is not a function.');
    }







};

