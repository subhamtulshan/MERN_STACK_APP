import React, { useState, useCallback, useEffect } from "react";

export const AuthHooks = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const login = useCallback((userId, token, expirationTime) => {
    setToken(token);
    setUserId(userId);
    const expiration =
      expirationTime || new Date(new Date().getTime() + 1000 * 60 * 60);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        token: token,
        expiration: expiration.toISOString()
      }),
      []
    );
  });

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userData"));
    if (userdata && userdata.token) {
      if (new Date(userdata.expiration) > new Date())
        login(userdata.userId, userdata.token, new Date(userdata.expiration));
      if (new Date(userdata.expiration) <= new Date()) {
        logout();
      }
    }
  }, [login, logout]);

  return [login, logout, token, userId];
};
