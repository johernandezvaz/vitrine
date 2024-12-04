import { FC } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CustomCalendarProps {
  value: Date;
}

const CustomCalendar: FC<CustomCalendarProps> = ({ value }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Calendario</h2>
      <Calendar value={value} className="w-full" />
    </div>
  );
};

export default CustomCalendar;