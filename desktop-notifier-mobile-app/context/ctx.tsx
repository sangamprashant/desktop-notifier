import React, { useEffect } from "react";
import { useStorageState } from "./useStorageState";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

// Define the context type with the correct function signatures
type AuthContextType = {
  saveProject: ({
    appName,
    projectId,
  }: {
    appName: string;
    projectId: string;
  }) => void;
  clearSession: () => void;
  appName: string;
  projectId: string;
};

export const AppContext = React.createContext<AuthContextType>({
  saveProject: () => null,
  clearSession: () => null,
  appName: "",
  projectId: "",
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AppContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [appName, setAppName] = useStorageState("appName");
  const [projectId, setProjectId] = useStorageState("projectId");
  const router = useRouter();

  const saveProject = ({
    appName,
    projectId,
  }: {
    appName: string;
    projectId: string;
  }) => {
    // Save to state
    setAppName(appName);
    setProjectId(projectId);
    router.replace("/home");
  };

  useEffect(() => {
    if (projectId) {
      router.replace("/home");
    }
  }, [projectId]);

  const clearSession = () => {
    setAppName(null);
    setProjectId(null);
    router.replace("/");
  };

  return (
    <AppContext.Provider
      value={{
        saveProject,
        clearSession,
        appName,
        projectId,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
