import { createContext, useContext } from "react";

/** True inside the shell's mobile menu, where the sidebar is always expanded and cannot collapse. */
const VSidebarMenuContext = createContext(false);

/** Reports whether the sidebar is drawn inside the mobile menu of VAdminShell. */
function useInsideMenu(): boolean {
  return useContext(VSidebarMenuContext);
}

export { VSidebarMenuContext, useInsideMenu };
