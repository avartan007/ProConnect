import React, { useEffect } from 'react';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { AcceptConnection, getConnectionsRequest, getMyConnectionRequests } from '@/config/redux/action/authAction';
import styles from './style.module.css';
import { BASE_URL, clientServer } from '@/config';
import { useRouter } from 'next/router';

function MyConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state)=> state.auth);
  const router = useRouter();

  useEffect(()=>{
    dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));
    dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
  },[dispatch])

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{display:"flex", flexDirection:"column", gap:"1.5rem"}}>
          <h4>My Connections</h4>
          {authState.isLoading && <p role="status">Loading connections...</p>}
          {authState.connectionRequest.length===0&& 
            <h1>No Connection Request Pending</h1>
          }
          {authState.connectionRequest.length!=0 && authState.connectionRequest.filter((connection)=>connection.status_accepted===null).map((user, index)=>{
            return (
              <div onClick={()=>{router.push(`/view_profile/${user.userId.username}`)}} className={styles.userCard} key={index}>
                <div style={{display:"flex", alignItems:"center", gap:"1.2rem"}}>
                  <div className={styles.profilePicture}>
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt={`${user.userId.name}'s profile`}/>
                  </div>
                  <div className={styles.userInfo}>
                    <h2>{user.userId.name}</h2>
                    <p>{user.userId.username}</p>
                  </div>
                  <button onClick={(e)=>{
                    e.stopPropagation();
                    dispatch(AcceptConnection({
                      connectionId: user._id,
                      token: localStorage.getItem("token"),
                      action: "accept"
                    }));
                    }} className={styles.connectBtn}>Accept</button>
                </div>
              </div>
            )
          })}

          <h4>My Network</h4>
          {authState.connectionRequest.filter((connection)=>connection.status_accepted === true).map((user, index)=>{
            return (
              <div onClick={()=>{router.push(`/view_profile/${user.userId.username}`)}} className={styles.userCard} key={index}>
                <div style={{display:"flex", alignItems:"center", gap:"1.2rem"}}>
                  <div className={styles.profilePicture}>
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt={`${user.userId.name}'s profile`}/>
                  </div>
                  <div className={styles.userInfo}>
                    <h2>{user.userId.name}</h2>
                    <p>{user.userId.username}</p>
                  </div>
                </div>
              </div>
            )
          })}
          
          {authState.connections.filter((connection)=>connection.status_accepted === true).map((user, index)=>{
            return (
              <div onClick={()=>{router.push(`/view_profile/${user.connectionId.username}`)}} className={styles.userCard} key={index}>
                <div style={{display:"flex", alignItems:"center", gap:"1.2rem"}}>
                  <div className={styles.profilePicture}>
                    <img src={`${BASE_URL}/${user.connectionId.profilePicture}`} alt={`${user.connectionId.name}'s profile`}/>
                  </div>
                  <div className={styles.userInfo}>
                    <h2>{user.connectionId.name}</h2>
                    <p>{user.connectionId.username}</p>
                  </div>
                </div>
              </div>
            )
          })}

        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export default MyConnectionsPage