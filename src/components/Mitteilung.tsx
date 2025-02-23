import React, { useState, useEffect } from 'react';
import { fetchUnreadNotifications, markNotificationAsRead } from '../backend/api';
import { NotificationResource } from '../Resources';
import './../style/Baker_CSS/AlleMitteilungen.css';
import { LoadingIndicator } from './LoadingIndicator';

const Mitteilung = () => {
  const [notifications, setNotifications] = useState<NotificationResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data: NotificationResource[] = await fetchUnreadNotifications();
      setNotifications(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className='mitteilungenBody'>
      {loading ? (
        <div className="loading-indicator"><LoadingIndicator /></div>
      ) : (
        notifications.length === 0 ? (
          <p>Keine Mitteilungen vorhanden</p>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="notification">
              <p>{notification.message}</p>
              <button onClick={() => handleMarkAsRead(notification.id!)}>Als gelesen markieren</button>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default Mitteilung;