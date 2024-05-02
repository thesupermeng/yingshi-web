import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Placeholder } from '@/asset/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

export const VideoVerticalCard = ({ vod }) => {
  const router = useRouter();

  const listConverter = (strings) => {
    let list = [];
    list = strings.split(',').filter((item) => item !== '');
    return list;
  };
  return (
    <div className='flex flex-col items-center'>
      <div className='relative flex w-full aspect-[530/726] group mx-4 my-2 rounded-lg'>
        <Image
          placeholder='blur'
          blurDataURL={Placeholder.src}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/play/${vod.type_id}/1/${vod.vod_id}`);
          }}
          alt='video'
          src={vod.vod_pic}
          style={{ borderRadius: '0.5rem !important', objectFit: 'cover' }}
          fill
          sizes='100%'
          className='rounded-lg md:transition md:group-hover:scale-150 md:group-hover:duration-500
              md:group-hover:cursor-pointer group-hover:rounded-lg md:group-hover:z-10 md:group-hover:rounded-lg'
        />

        <div
          className='bg-[#0000008c] h-[100%] w-full flex flex-col rounded-lg md:transition md:group-hover:scale-150 
           md:group-hover:duration-500 md:group-hover:cursor-pointer group-hover:rounded-lg 
           md:group-hover:z-10 md:group-hover:rounded-lg'
          onClick={(e) => {
            e.preventDefault();
            router.push(`/play/${vod.type_id}/1/${vod.vod_id}`);
          }}
        >
          <div className='rounded-t-lg w-full h-[45%] flex justify-center items-center'>
            <div className='rounded-full bg-[#0085E0] w-10 h-10 flex justify-center items-center'>
              <FontAwesomeIcon
                style={{
                  fontSize: '18px',
                }}
                icon={faPlay}
              />
            </div>
          </div>
          <div className='bg-[#1D2023] rounded-b-lg w-full h-[55%] p-2 flex flex-col overflow-hidden'>
            <span className='text-[10px]/6 text-[#0085E0] font-bold'>
              {vod.vod_name}
            </span>
            <div className='flex flex-row gap-1 flex-wrap py-1'>
              {vod.vod_actor !== undefined &&
                listConverter(vod.vod_actor).map((item, index) => {
                  return (
                    <span
                      key={index}
                      className='rounded-md bg-[#ffffff1a] text-[7px] text-[#9C9C9C] font-bold p-1'
                    >
                      {item}
                    </span>
                  );
                })}
            </div>
            <div className='flex overflow-hidden'>
              <span className='text-[7px] text-[#9C9C9C] font-bold text-ellipsis '>{vod.vod_content}</span>
            </div>
          </div>
        </div>

        {vod.vod_remarks !== undefined ? (
          <div className='flex absolute w-full bottom-1 px-1.5 justify-end'>
            <div className='bg-[#00000099] rounded-md p-1 max-w-full'>
              <p className='text-xs truncate'>{vod.vod_remarks}</p>
            </div>
          </div>
        ) : null}
      </div>
      <span className='text-center text-sm mx-1'>{vod.vod_name}</span>
    </div>
  );
};
