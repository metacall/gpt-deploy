import React, {useCallback, useEffect, useContext} from 'react'
import { faToggleOff, faToggleOn, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { metacallBaseUrl } from '../../constants/URLs'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'
import { MessageContext } from '../MessageStack/MessageStack'
import { recaptchaSiteKey } from '../../constants/URLs'

function MetacallTokenInput({text, setText, loginByToken, setLoginByToken, placeholder='', className='', ...props}) {
    const [userName, setUserName] = React.useState('')
    const [password, setPassword] = React.useState('')
    const {addSuccess, addError} = useContext(MessageContext)
    const captchaRef = React.useRef(null)
    const setMetacallTokenByLogin = useCallback(async ()=>{

        try{
            console.log('tokening')
            const token = await captchaRef.current.executeAsync()
            console.log(token)
            axios.post(metacallBaseUrl + '/login', {
                    email: userName,
                    password: password,
                    "g-recaptcha-response": token
                })
                .then(res => {
                    const token = res.data;
                    setText(token)
                    setLoginByToken(false)
                    addSuccess('Login successful!')
                })
                .catch(err => {
                    addError(err?.response?.message ?? 'Login failed!')
                });
        } catch {
            addError('failed to resolve captcha')
        }

        captchaRef.current.reset()
    },[userName, password, addError, addSuccess ,setText, setLoginByToken]) 

    return (
        <div className='flex w-full my-3 bg-white items-center'>
            <div className='primary-border box-border flex h-full w-full'>
            {
                !loginByToken?
                <input type='text' className={'bg-white box-border w-full p-2 outline-none mr-2  ' + (props.disabled? 'text-sm text-gray-400': 'text-gray-700')} value={text} 
                    placeholder={placeholder}
                    onChange={(e)=>setText(e.target.value)} 
                    {...props}/>
                :
                (
                    <React.Fragment>
                        <form className='box-border flex h-full w-full' onSubmit={(e)=>e.preventDefault()}>
                            <input type='text' className={'bg-white focus:border-zinc-600 focus:border-2 box-border primary-border w-full m-0 p-2 outline-none  ' + (props.disabled? 'text-sm text-gray-400': 'text-gray-700')} value={userName}
                            placeholder='Username'
                            onChange={(e)=>setUserName(e.target.value)}
                            autoComplete='username'
                            />
                            <input type='password' className={'bg-white focus:border-zinc-600 focus:border-2 box-border w-full primary-border p-2 m-0 outline-none  ' + (props.disabled? 'text-sm text-gray-400': 'text-gray-700')} value={password}
                            placeholder='Password'
                            onChange={(e)=>setPassword(e.target.value)}
                            autoComplete='current-password'
                            />
                            <ReCAPTCHA 
                                sitekey={recaptchaSiteKey} 
                                ref={captchaRef}
                                size='invisible'
                            />
                            <button className='px-4 py-2 hover:bg-slate-200 active:shadow-lg active:shadow-slate-400'
                                onClick={setMetacallTokenByLogin}
                                title="Login"
                            >
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                        </form>
                    </React.Fragment>
                    )
            }
            </div>
            <button className={"h-full place-content-center flex ml-2 p-2 items-center w-16 bg-black text-white primary-border " + (props.disabled && 'bg-gray-400')  }
                onClick={()=>setLoginByToken(!loginByToken)}
                disabled={props.disabled}
            >
                <FontAwesomeIcon icon={loginByToken? faToggleOn :faToggleOff} title={!loginByToken ? 'login by password' : 'login by metacalltoken'} className='cursor-pointer w-full' />
            </button>
        </div>
    )
}

export default MetacallTokenInput
