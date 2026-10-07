import React, { useEffect} from 'react';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from './style.module.css';
import { useRouter } from 'next/router';

function Discoverpage () {

  const router = useRouter();
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  useEffect(()=>{
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched, dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <h1>Discover</h1>
        {authState.isLoading && <p role="status">Loading profiles...</p>}
        {authState.isError && <p role="alert">Unable to load profiles right now.</p>}
        <div >
          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched && authState.all_users.filter((user) => user.userId).map((user)=>{
              return (
                <div onClick={()=>{
                  router.push(`/view_profile/${user.userId.username}`)
                }} key={user._id} className={styles.userCard}>
                  <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt={`${user.userId.name}'s profile`}></img>
                  <div>
                    <h2>{user.userId.name}</h2>
                    <p>{user.userId.username}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export default Discoverpage 