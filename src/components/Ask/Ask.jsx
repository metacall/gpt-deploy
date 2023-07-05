import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
export default function Ask({timestamp, query }) {
    timestamp = new Date()-0
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
            <div className='primary-border text-sm min-w-min ml-auto break-all p-4 whitespace-pre-wrap' style={{maxWidth: '40%', padding:''}}>
                {query}
            </div>
        </div>
    )
}