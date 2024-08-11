import { useSession } from "next-auth/react";
import { api } from "../trpc/react";
import useOrganization from "./useOrganization";

const useApiKeyMutation = () => {
  const org = useOrganization();

  return api.organization.setApiKey.useMutation({
    onSuccess: () => org.refetch(),
  });
};

export default useApiKeyMutation;
