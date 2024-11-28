const Spinner = ({ message }: { message?: string }) => {
  return (
    <div className='absolute inset-0 flex justify-center items-center h-full w-full flex-col'>
      <div className='size-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
      <div className='mt-2'>{message}</div>
    </div>
  );
};

export default Spinner;
