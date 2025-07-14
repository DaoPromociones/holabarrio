import { useEffect, useState } from "react";
import { User } from "@/core/models/user";
import { userServiceInstance } from "@/lib/di-container";

export function useUserSubscription(userId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setError(null);
      return;
    }
    const unsubscribe = userServiceInstance.subscribeToUser(
      userId,
      (u) => {
        if (!u) {
          setUser(null);
          setError(null);
          return;
        }
        setUser({
          id: userId,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          purchasedReports: u.purchasedReports,
          updatedAt: u.updatedAt,
          usedReports: u.usedReports,
        });
        setError(null);
      },
      (err) => {
        setError(err);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  return { user, error };
}
