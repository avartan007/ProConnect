import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer__left}>
            <p>Build a network that feels real.</p>
            <p>Share your work, discover people, and grow with meaningful connections.</p>
            <button type="button" onClick={()=>{router.push("/login")}} className={styles.buttonJoin}>
              <p>Join Now</p>
            </button>
          </div>
          <div className={styles.mainContainer__right}>
            <img src="images/homemain_connection.jpg" alt=""/>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}