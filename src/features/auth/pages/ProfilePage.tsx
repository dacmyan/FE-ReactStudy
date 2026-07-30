import { EmptyState, ErrorState, LoadingState } from "@/shared/components/states/StatusState";
import { useUser } from "@/features/auth/hooks/useUser";

const ProfilePage = () => {
  // const [user, setUser] = useState<any>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // // const [error, setError] = useState<string | null>(null);

  const {
    data: userData, // rename data thành userData để dễ hiểu
    isLoading, // true = Fetch bị lỗi
    isError, // true = Fetch bị lỗi
    error, // Error object nếu có
    refetch, // Function để fetch lại mamually
  } = useUser();

  if (isLoading) return <LoadingState />;
  if (isError)
    return (
      <ErrorState
        message={error?.message ?? "Có lỗi xảy ra"}
        onRetry={() => refetch()}
      />
    );
  if (!userData) return <EmptyState />;

  return (
    <>
      <div>ProfilePage</div>
      <div>{userData?._id}</div>
      <div>{userData?.email}</div>
    </>
  );
};

export default ProfilePage;
