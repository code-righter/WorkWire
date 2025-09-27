import React from 'react'
import Calendar from './Calender/Calender.jsx'
import UrgentTasks from './UrgentTaskList/UrgentTaskList.jsx'

const ManagerDashboard = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[200vh] p-2">
        {/*Welcome Msg  */}
        <div className='text-gray-800 py-4 pb-2 px-2 text-2xl font-medium border-b-1'>
            <h1>
                Welcome, Abhijeet!!
            </h1>
        </div>
        <div className="flex flex-grid grid-cols-2 gap-8 p-5 justify-left">

            {/* Calender */}
            <div className=''>
                <Calendar/>
            </div>

            {/* Urgent Tasks */}
            <div>
                <UrgentTasks/>
            </div>
        </div>


        
    </div>
  )
}

export default ManagerDashboard