import React from 'react';
import Navbar from '../../Common/Navbar';
import AdminDrawerList from '../Sidebar/AdminDrawerList';
import AdminRoutes from '../../routes/AdminRoutes';

const Dashboard = () => {
  return (
    <div className='min-h-screen' style={{ background: '#f8fafc' }}>
      <Navbar DrawerList={AdminDrawerList} />
      <section className='lg:flex lg:h-[90vh]'>
        <div className='hidden lg:block h-full'>
          <AdminDrawerList />
        </div>
        <div className='flex-1 overflow-auto p-6 lg:p-8'>
          <AdminRoutes />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
