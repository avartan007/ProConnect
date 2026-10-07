import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css';
import { useRouter } from 'next/router';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

function LoginComponent() {
  const authState = useSelector((state) => state.auth)

  const router = useRouter();

  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if(authState.loggedIn){
      router.push("/dashboard")
    }
  }, [authState.loggedIn, router])

  useEffect(() => {
    dispatch(emptyMessage());
  }, [dispatch, userLoginMethod])

  const handleRegister = () => {
    dispatch(registerUser({username,password,email,name}));
  }

  const handleLogin = () => {
    dispatch(loginUser({email,password}));
  }

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <div className={styles.formEyebrow}>{userLoginMethod ? "Welcome back" : "Get started today"}</div>
            <p className={styles.cardleft__heading}>{userLoginMethod ? "Sign in to your network" : "Create your account"}</p>
            <p className={styles.formDescription}>
              {userLoginMethod
                ? "Pick up where you left off and keep building meaningful connections."
                : "Join professionals who share ideas, opportunities, and momentum."}
            </p>
            <p role="status" aria-live="polite" style={{color: authState.isError?"red":"green"}}>
              {typeof authState.message === "string" ? authState.message : authState.message?.message}
            </p>
              <div className={styles.inputContainers}>
                {!userLoginMethod&&
                <div className={styles.inputRow}>
                  <label className={styles.fieldGroup}><span>Username</span><input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder='yourname' autoComplete="username"/></label>
                  <label className={styles.fieldGroup}><span>Full name</span><input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder='Your name' autoComplete="name"/></label>
                </div>
                }
                <label className={styles.fieldGroup}><span>Email address</span><input onChange={(e) => setEmail(e.target.value)} className={styles.inputField} type="email" autoComplete="email" placeholder='you@example.com' required/></label>
                <label className={styles.fieldGroup}><span>Password</span><input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="password" autoComplete={userLoginMethod ? "current-password" : "new-password"} placeholder='At least 8 characters' required/></label>
                <button type="button" disabled={authState.isLoading} onClick={() => {
                  if(userLoginMethod){
                    handleLogin();
                  }else{
                    handleRegister();
                  }
                }} className={styles.buttonWithOutline}>
                  <span>{authState.isLoading ? "Please wait..." : userLoginMethod ? "Sign in" : "Create account"}</span>
                </button>
              </div>

          </div>
          <div className={styles.cardContainer__right}>
                <div className={styles.sideMark}>PC</div>
                <p className={styles.sideHeading}>{userLoginMethod ? "New to ProConnect?" : "Already a member?"}</p>
                <p className={styles.sideDescription}>{userLoginMethod ? "Create a profile and start meeting people who move your career forward." : "Sign in to access your conversations, feed, and connections."}</p>
                <div onClick={() => {
                  setUserLoginMethod(!userLoginMethod)
                }} className={styles.secondaryButton}>
                  <span>{userLoginMethod ? "Create an account" : "Sign in instead"}</span>
                </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default LoginComponent