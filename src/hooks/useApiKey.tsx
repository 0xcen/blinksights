import { useSession } from "next-auth/react";
import { api } from "../trpc/react";

const useApiKey = () => {
  const { data: session } = useSession();

  const org = api.organization.get.useQuery(undefined, {
    enabled: !!session?.org?.id,
  });

  const createApiKeyMutation = api.organization.setApiKey.useMutation({
    onSuccess: () => org.refetch(),
  });

  return {
    createApiKeyMutation,
    org,
  };
};

export default useApiKey;
