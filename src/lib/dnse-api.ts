const URL = "https://services.entrade.com.vn";

export const login = async (username: string, password: string) => {
  const res = await fetch(`${URL}/dnse-auth-service/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  return res;
};

export const validateOTP = async (jwtToken: string, smartOTP: string) => {
  const res = await fetch(`${URL}/dnse-order-service/trading-token`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${jwtToken}`,
      "smart-otp": smartOTP,
    },
  });
  const data = await res.json();
  return data;
};

export const sendEmailOTPRequest = async (jwtToken: string) => {
  const res = await fetch(`${URL}/dnse-auth-service/api/email-otp`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${jwtToken}`,
    },
  });
  const data = await res.json();
  return data;
};

export const getUserInfo = async (jwtToken: string) => {
  const res = await fetch(`${URL}/dnse-user-service/api/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  const data = await res.json();
  return data;
};

export const getAccountsList = async (jwtToken: string) => {
  const res = await fetch(`${URL}/dnse-order-service/accounts`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + jwtToken,
    },
  });
  const data = await res.json();
  return data;
};

export const getLoanPackages = async (jwtToken: string, accountId: string) => {
  const res = await fetch(
    `${URL}/dnse-order-service/v2/accounts/${accountId}/loan-packages`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  const data = await res.json();
  return data.loanPackages;
};

export const getSucMuaSucBan = async (
  jwtToken: string,
  accountId: string,
  symbol: string,
  price: string,
  loanPackageId: string,
) => {
  const res = await fetch(
    `${URL}/dnse-order-service/accounts/${accountId}/ppse?symbol=${symbol}&price=${price}&loanPackageId=${loanPackageId}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  const data = await res.json();
  return data;
};

export const getAccountOrders = async (jwtToken: string, accountNo: string) => {
  const res = await fetch(
    `${URL}/dnse-order-service/v2/orders?accountNo=${accountNo}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
};

export const getAccountBalances = async (
  jwtToken: string,
  accountNo: string,
) => {
  const res = await fetch(
    `${URL}/dnse-order-service/account-balances/${accountNo}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
};

export const getOrders = async (jwtToken: string, accountNo: string) => {
  const res = await fetch(
    `${URL}/dnse-order-service/v2/orders?accountNo=${accountNo}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data.orders;
  }
};

export const deleteOrder = async (
  jwtToken: string,
  tradingToken: string,
  id: number,
  accountNo: string,
) => {
  const res = await fetch(
    `${URL}/dnse-order-service/v2/orders/${id}?accountNo=${accountNo}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + jwtToken,
        "Trading-Token": tradingToken,
      },
    },
  );
  const data = await res.json();
  return data;
};

export const getConditionOrders = async (
  jwtToken: string,
  accountNo: string,
) => {
  const res = await fetch(
    `https://services.dnse.com.vn/conditional-order-api/v1/orders?accountNo=${accountNo}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
};

export const getDeals = async (jwtToken: string, accountNo: string) => {
  const res = await fetch(
    `${URL}/dnse-deal-service/deals?accountNo=${accountNo}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data.deals;
  }
};

export const postPlaceOrder = async (
  jwtToken: string,
  tradingToken: string,
  order: any,
) => {
  const res = await fetch(`${URL}/dnse-order-service/v2/orders`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + jwtToken,
      "Content-Type": "application/json",
      "trading-token": tradingToken,
    },
    body: JSON.stringify(order),
  });
  const data = await res.json();
  if (res.ok) {
    return data;
  }
  throw new Error(data.message);
};

// 5.1
export const getPhaiSinhLoanPackages = async (
  jwtToken: string,
  accountId: string,
) => {
  const res = await fetch(
    `${URL}/dnse-order-service/accounts/${accountId}/derivative-loan-packages`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  const data = await res.json();
  return data.loanPackages;
};

// 5.2
export const getPhaiSinhSucMuaSucBan = async (
  jwtToken: string,
  accountId: string,
  symbol: string,
  price: string,
  loanPackageId: string,
) => {
  const res = await fetch(
    `${URL}/dnse-order-service/accounts/${accountId}/derivative-ppse?symbol=${symbol}&price=${price}&loanPackageId=${loanPackageId}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  const data = await res.json();
  return data;
};

// 5.3
export const placeOrderPhaiSinh = async (
  jwtToken: string,
  tradingToken: string,
  order: any,
) => {
  const res = await fetch(`${URL}/dnse-order-service/derivative/orders`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + jwtToken,
      "Trading-Token": tradingToken,
    },
    body: JSON.stringify(order),
  });
  const data = await res.json();
  return data;
};

// 5.4
export const getOrdersPhaiSinh = async (
  jwtToken: string,
  accountNo: string,
) => {
  const res = await fetch(
    `${URL}/dnse-order-service/derivative/orders?accountNo=${accountNo}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data.orders;
  }
};

// 5.6
export const deleteOrderPhaiSinh = async (
  jwtToken: string,
  tradingToken: string,
  accountNo: string,
  orderId: any,
) => {
  const res = await fetch(
    `${URL}/dnse-order-service/derivative/orders/${orderId}?accountNo=${accountNo}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + jwtToken,
        "Trading-Token": tradingToken,
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
};

// 5.7
export const getDealsPhaiSinh = async (jwtToken: string, accountNo: string) => {
  const res = await fetch(
    `${URL}/dnse-derivative-core/deals?accountNo=${accountNo}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data.orders;
  }
};

// 5.8
export const setupStopLossByDealPhaiSinh = async (
  jwtToken: string,
  tradingToken: string,
  dealId: string,
  data: any,
) => {
  const res = await fetch(
    `${URL}/dnse-derivative-deal-risk/pnl-configs/${dealId}`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + jwtToken,
        "Trading-Token": tradingToken,
      },
      body: JSON.stringify(data),
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
};

export const getLeaderships = async (symbol: string) => {
  const res = await fetch(
    `${URL}/senses-api/leaderships?symbol=${symbol}&language_id=1%27`,
  );

  if (res.ok) {
    const data = await res.json();
    return data;
  }
};
