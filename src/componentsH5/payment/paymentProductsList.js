import React, {useState} from 'react';
import style from './paymentProductList.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons';

export default function PaymentProductsList({className}) {
  const [selectedProduct, setSelectedProduct] = useState(0)

  return (
    <div className={`h-[194px] w-full overflow-scroll flex flex-nowrap gap-[20px] items-center ${className}`}>
      {[0, 1, 2, 3, 4].map((product, index) => {
        return <Product key={index} isSelected={selectedProduct === index}
                        onProductSelect={() => setSelectedProduct(index)}/>
      })

      }
    </div>
  );
}

function Product({isBest, isSelected, productInfo, onProductSelect}) {
  return (
    <div
      className={`${isSelected ? 'h-[190px] border-2 border-[#D4AE7F]' : 'h-[180px]'} 
      ${style.product_card_animation}
      w-[140px] rounded-[8px] overflow-hidden flex flex-col flex-none relative 
      `}
      onClick={onProductSelect}
    >


      <div className={'flex-1 w-full absolute'}>
        {/* overlay */}
        {isSelected && isBest &&
          <div
            className={'flex w-fit items-center justify-center rounded-tl-[8px] rounded-br-[8px] bg-[#FA3E3E] px-[9px] py-[4px] top-0 left-0'}>
            <span className={'text-white text-[14px] font-semibold'}>最多人选择</span>
          </div>
        }
        <FontAwesomeIcon
          icon={faCheckCircle}
          style={{color: '#D4AE7F', width:'20px', height: '20px'}}
          className={`absolute top-[5px] right-[5px] z-10 ${isSelected ? 'block' : 'hidden'}`}
        />
      </div>
      <div
        className={`flex-1 w-full flex flex-col items-center justify-center gap-2 ${style.product_card_background_color} ${isSelected ? style.selected : ''}`}>
        <span className={'text-[18px] text-white font-semibold'}>1个月</span>
        <span className={'text-[18px] text-[#F4DBBA] font-bold'}>￥33</span>
      </div>
      {isSelected && (
        <div className={'h-[35px] bg-[#F9EBDB] flex items-center justify-center'}>
          <span className={'text-[15px] text-black font-semibold'}>￥33.3/月</span>
        </div>
      )}
      {!isSelected && (
        <div className={'h-[37px] bg-[#393939] flex items-center justify-center'}>
          <span className={'text-[15px] text-white font-semibold'}>￥33.3/月</span>
        </div>
      )}
    </div>
  )


}
