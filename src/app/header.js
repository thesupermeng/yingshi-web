import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Logo, searchIcon, HistoryIcon, PhoneIcon } from '@/asset/icons';

export const Header = ({ topNav, selected, changePage }) => {
  const [value, setValue] = useState('');
  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  return (
    <div className='flex flex-row justify-around py-4 items-center'>
      <div>
        <Image alt='鲨鱼影视' src={Logo} />
      </div>
      <div className='relative'>
        <input
          type='text'
          placeholder='输入搜索关键词'
          value={value}
          onChange={handleChange}
          className='w-96 border-0 border-gray-300 text-white rounded-md px-4 py-1 focus:outline-none '
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />
        <Image
          className='h-6 w-6 absolute right-2 top-2/4 transform -translate-y-2/4 text-gray-400'
          src={searchIcon}
          alt='search'
          width={20}
        />
      </div>
      <div className='flex flex-row space-x-4'>
        {topNav?.map((navItem, id) => {
          return (
            <div
              className='flex flex-col items-center cursor-pointer'
              id={navItem.id}
              key={id}
              onClick={() => {
                changePage(navItem.id);
              }}
            >
              <span
                className={`transition-colors duration-300 ${
                  selected === navItem.id ? 'text-blue-500' : 'text-white'
                } hover:text-blue-500`}
              >
                {navItem.name}
              </span>
              {selected === navItem.id ? (
                <div className='border-2 border-blue-500 w-5 h-0.5 rounded-lg'></div>
              ) : null}
            </div>
          );
        })}

        <div className='flex flex-row  justify-around cursor-pointer'>
          <Image
            className='cursor-pointer'
            src={HistoryIcon}
            alt='search'
            width={30}
          />
          <div class='flex items-center px-5'>
            <div className='border-l-2 border-white h-4' />
          </div>
          <div className='flex flex-row cursor-pointer'>
            <Image className='px-1' src={PhoneIcon} alt='search' width={24} />
            <div className='flex items-center'>APP</div>
          </div>
        </div>
        <div className='cursor-pointer'>history</div>
        <div className='cursor-pointer'>report</div>
      </div>
    </div>
  );
};
