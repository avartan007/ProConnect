import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';
import { clientServer } from '@/config';

function NavbarComponent() {
    const router= useRouter();
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const hasSession = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));
  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1 style={{cursor:"pointer"}} onClick={()=>{
            router.push("/")
        }}>Pro Connect</h1>
        <div className={styles.navBarOptionContainer}>

          {(authState.profileFetched || hasSession)&& <div>
            <div style={{display: "flex", gap:"1.2rem"}}>
              {/* <p>Hey, {authState.user.userId.name}</p> */}
              <p onClick={()=>{router.push("/profile")}} style={{fontWeight: "bold", cursor: "pointer"}}>Profile</p>
              <p onClick={async () => {
                try {
                  await clientServer.post("/logout", {token: localStorage.getItem("token")});
                } finally {
                localStorage.removeItem("token")
                dispatch(reset())
                router.push("/login")
                }
              }} style={{fontWeight: "bold", cursor: "pointer"}}>Logout</p>
            </div>
          </div>}

          {!authState.profileFetched && !hasSession &&
            <div onClick={() => {
                router.push("/login")
            }} className={styles.buttonJoin}>
                <p>Be a part</p>
            </div>}

        </div>
      </nav>
    </div>
  )
}

export default NavbarComponent