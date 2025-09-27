import React, { useState } from "react";

const Calendar = ({ deadlines = [] }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const getMonthMatrix = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    let days = [];
    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonthDays - i, outside: true });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, outside: false });
    }
    // Next month's leading days
    while (days.length % 7 !== 0) {
      days.push({ date: days.length - daysInMonth - firstDay + 1, outside: true });
    }
    return days;
  };

  const handleChangeMonth = (offset) => {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setMonth(newMonth); setYear(newYear);
  };

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekDays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const days = getMonthMatrix();

  return (
    <div className="bg-blue-50 rounded-3xl shadow p-2 w-80 h-63">
      <div className="flex justify-between items-center px-2 mb-3">
        <span className="font-bold text-base">{monthNames[month]} {year}</span>
        <div>
          <button className="mx-1 p-1.5 rounded-full hover:bg-gray-100 text-sm" onClick={()=>handleChangeMonth(-1)}>&lt;</button>
          <button className="mx-1 p-1.5 rounded-full hover:bg-gray-100 text-sm" onClick={()=>handleChangeMonth(1)}>&gt;</button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-1">
        {weekDays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-xs text-center">
        {days.map((d, i) => {
          const thisDate = new Date(year, month, d.date);
          const isToday = !d.outside && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d.date;
          const isDeadline = deadlines.some(dt => {
            const dd = new Date(dt);
            return dd.getFullYear() === year && dd.getMonth() === month && dd.getDate() === d.date;
          });
          return (
            <div
              key={i}
              className={`h-6 w-6 mx-auto flex items-center justify-center rounded-full text-xs
                ${d.outside ? "text-gray-300" : ""}
                ${isToday ? "bg-blue-500 text-white font-bold" : ""}
                ${isDeadline ? "bg-orange-500 text-white font-bold" : ""}
                ${(!isToday && !isDeadline && !d.outside) ? "hover:bg-gray-100 cursor-pointer" : ""}
              `}
            >
              {d.date}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
