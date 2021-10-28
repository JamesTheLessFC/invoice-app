import styles from "../styles/page.module.scss";
import AppBar from "../components/AppBar";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import { SignInMessage } from "../components/SignInMessage";
import router from "next/router";

export default function Home() {
  const [session, loading] = useSession();

  useEffect(() => {
    if (session) {
      router.push("/invoices");
    }
  }, [session]);

  if (!session) {
    return (
      <div className={styles.root}>
        <AppBar />
        <SignInMessage />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <AppBar />
    </div>
  );
}
