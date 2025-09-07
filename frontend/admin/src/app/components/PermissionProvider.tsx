import { useAuth, UserModel } from "@@/auth";
import { ReactNode, createContext, useContext } from "react";

type PermissionProviderProps = {
  children: ReactNode;
};

const PermissionContext = createContext<string[] | null>(null);

export const PermissionProvider = ({ children }: PermissionProviderProps) => {

  const { currentUser }: { currentUser?: UserModel } = useAuth();

  console.log(currentUser)
  return (
    <PermissionContext.Provider value={currentUser?.permissions??[]}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);
