import { Watch } from 'react-loader-spinner';

function Loader(){
    return(
        <div className='flex justify-center items-center h-screen'>
            <Watch visible={true}
        height="80"
        width="80"
        radius="48"
        color="#000000"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
        </div>
    )
}

export default Loader;