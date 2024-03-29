import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
export default function Ask({timestamp, isFile, query }) {
    return (
        <div className='flex flex-col overflow-hidden '>
            <div className='min-w-min ml-auto primary-border text-sm my-4 px-2 py-1'>
                <span className='text-sm' style={{color:'#9C9C9C'}}>
                    {
                        moment(timestamp).format('D/MM/Y - TH:mm:ss')
                    }
                    &nbsp;
                    <FontAwesomeIcon icon={faClock}/>
                </span>
            </div>
            <div className='primary-border text-sm min-w-min ml-auto break-all p-4 whitespace-pre-wrap max-w-full md:max-w-40 '>
              {isFile && <FontAwesomeIcon icon={faFile} />}  {query}
            </div>
        </div>
    )
}