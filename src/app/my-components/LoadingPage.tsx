import Spinner from './Spinner';

const LoadingPage = ({ message }: { message?: string }) => {
  return (
    <div className='absolute inset-0 flex justify-center items-center h-full w-full flex-col'>
      <Spinner />
      <div className='mt-2'>{message}</div>
    </div>
  );
};

export default LoadingPage;
