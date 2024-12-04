import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { es } from 'date-fns/locale';

interface CustomCalendarProps {
  value: Date;
  onChange?: (date: Date) => void;
}

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const CustomCalendar: React.FC<CustomCalendarProps> = ({ value, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(format(new Date(), 'HH:mm'));
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setSelectedTime(format(new Date(), 'HH:mm'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleDateSelect = (date: Date) => {
    onChange?.(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        {/* Current Time Display */}
        <div className="flex items-center justify-center mb-4 text-lg font-semibold text-gray-700">
          <Clock className="h-5 w-5 mr-2 text-blue-500" />
          {format(currentTime, 'HH:mm:ss')}
        </div>

        {/* Date Picker Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
          {days.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => handleDateSelect(day)}
              className={`
                h-8 flex items-center justify-center text-sm rounded-full transition-colors
                ${
                  isSameMonth(day, currentMonth)
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }
                ${
                  isSameDay(day, value)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'hover:bg-gray-100'
                }
                ${
                  isSameDay(day, new Date())
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : ''
                }
              `}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>

      {/* Time Picker */}
      <div className="mt-4">
        <Listbox value={selectedTime} onChange={setSelectedTime}>
          <div className="relative mt-1">
            <Listbox.Button 
              onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
              className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm"
            >
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{selectedTime}</span>
              </span>
            </Listbox.Button>
            <Transition
              show={isTimePickerOpen}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {timeSlots.map((time) => (
                  <Listbox.Option
                    key={time}
                    value={time}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {time}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default CustomCalendar;