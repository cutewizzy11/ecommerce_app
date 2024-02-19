import React, { useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import TextToSpeechComponent from '../../components/TextToSpeechComponent';

const Dashboard = () => {
  const [auth] = useAuth();

  const generateSpeechText = () => {
    const name = auth?.user?.name || '';
    const email = auth?.user?.email || '';
    const address = auth?.user?.address || '';

    return `${name}. ${email}. ${address}.`;
  };

  useEffect(() => {
    // Move the speech logic here
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(generateSpeechText());
      window.speechSynthesis.speak(utterance);
    };

    // Trigger speech when the component mounts or when user data changes
    speak();
  }, [auth]);

  return (
    <Layout title={'Dashboard - Ecommerce App'}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>{auth?.user?.name}</h3>
              <h3>{auth?.user?.email}</h3>
              <h3>{auth?.user?.address}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
