import { createContext, useContext, useState } from "react";

const RequestsContext = createContext();

export const RequestsProvider = ({ children }) => {
  const [pendingCount, setPendingCount] = useState(0);

  return (
    <RequestsContext.Provider
      value={{ pendingCount, setPendingCount }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => useContext(RequestsContext);
