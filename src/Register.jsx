import React, { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// const USER_REGEX = /^[aA-zA][aA-zZ0-9-_]{3, 23}$/;
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const SpecialSymbol = ({specialSymbolType}) => {
    const symbolsToAriaLabels = {
        '@': 'at symbol',
        '!': 'exclamation mark',
        '#': 'hashtag',
        '$': 'dollar sign',
        '%': 'percent',
    };
    return <span aria-label={symbolsToAriaLabels[specialSymbolType]}>{specialSymbolType}</span>;
};

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState({
        value: '',
        name: 'username',
        isValid: false,
        isFocused: false,
        // errMessage: 'Username must be start with a letter and contain from 4 up to 24 characters',
    });

    const [pwd, setPwd] = useState({
        value: '',
        name: 'pwd',
        isValid: false,
        isFocused: false,
    });

    const [matchPwd, setMatchPwd] = useState({
        value: '',
        name: 'match-pwd',
        isValid: false,
        isFocused: false,
    });

    // console.log('MARMUUUUU',user.isValid, pwd.isValid, matchPwd.isValid);
    const [errMessage, setErrMessage] = useState('');
    const [requestStatus, setRequestStattus] = useState('idle');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        console.log('User validation');
        const isCurrentUserNameValid = USER_REGEX.test(user.value);
        setUser((prev) => ({...prev, isValid: isCurrentUserNameValid}));
    }, [user.value]);

    useEffect(() => {
        console.log('Validation');
        const isCurrentPwdValid = PWD_REGEX.test(pwd.value);
        setPwd((prev) => ({...prev, isValid: isCurrentPwdValid}));
        setMatchPwd((prev) => ({...prev, isValid: matchPwd.value === pwd.value}));
    }, [pwd.value, matchPwd.value]);

    /*
    useEffect(() => {
        const currentErrorMessage = generateErrorMessage();
        console.log('CURRENTErrorMessage', currentErrorMessage);
        setErrMessage(currentErrorMessage);
    }, [user.isValid, pwd.isValid, matchPwd.isValid]);
    */

    useEffect(() => {
        setErrMessage('');
    }, [user.value, pwd.value, matchPwd.value]);

    const fieldsToErrorMessages = {
        username: 'Username must start with a letter and contain from 4 up to 24 characters.Letters, numbers, hyphens, underscores are allowed',
        pwd: `<FontAwesomeIcon icon={faInfoCircle} /> Password must contain from 8 to 24 characters including at least 1 lowercase letter,
        1 uppercase letter, 1 digit and 1 special character.
        Allowed special characters are: <span aria-label="exclamation mark">!</span>
        <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>
        <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>`,
        'match-pwd': 'Passwords must match',
    };
  // <span aria-label="exclamation mark">!</span>
  // <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>
  // <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>,`
    const generateErrorMessage = () => {
        const fieldsToCheck = [user, pwd, matchPwd];
        const errMessage = fieldsToCheck
          .reduce((acc, el) => {
            const text = el.isValid ? '' : `${fieldsToErrorMessages[el.name]} `;
            return acc.concat(text);
        }, '');
        return errMessage.trim();
    };

    const handleInputChange = () => {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.isValid || !pwd.isValid || !matchPwd.isValid) {
            setErrMessage('Invalid Entry');
            return;
        }
        try {
            console.log(user.value, pwd.value);
        } catch (e) {
            setErrMessage(e.message);
        }
    };

    return  (
        <section>
            <p ref={errRef} className={errMessage.length > 0 ? "errMsg" : "offscreen"} aria-live="assertive">
                {errMessage}
            </p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">
                        Username
                        <span className={user.isValid ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={user.isValid || user.value.length === 0 ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        ref={userRef}
                        autoComplete="off"
                        value={user.value}
                        required
                        onChange={(e) => setUser((prev) => ({...prev, value: e.target.value}))}
                        aria-invalid={user.isValid ? "false" : "true"}
                        aria-describedby="uidnote"
                        // onFocus={() => setUser((prev) => ({...prev, isFocused: true}))}
                        onFocus={() => setUser((prev) => {
                            return {...prev, isFocused: true};
                        })}
                        onBlur={() => setUser((prev) => {
                            return {...prev, isFocused: false};
                        })}
                    />
                </div>
                <p
                  id="uidnote"
                  className={!user.isValid && user.isFocused && user.value.length > 0 ? "instructions" : "offscreen"}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    {fieldsToErrorMessages.username}
                </p>
                <div>
                    <label htmlFor="pwd">
                        Password
                        <span className={pwd.isValid ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={pwd.isValid || pwd.value.length === 0 ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>

                    </label>
                    <input
                        type="password"
                        id="pwd"
                        name="pwd"
                        value={pwd.value}
                        required
                        onChange={(e) => setPwd((prev) => ({...prev, value: e.target.value}))}
                        aria-invalid={pwd.isValid ? "false" : "true"}
                        aria-describedby="pwdidnote"
                        // onFocus={() => setUser((prev) => ({...prev, isFocused: true}))}
                        onFocus={() => setPwd((prev) => {
                            return {...prev, isFocused: true};
                        })}
                        onBlur={() => setPwd((prev) => {
                            return {...prev, isFocused: false};
                        })}
                    />
                </div>
                <p
                  id="pwdidnote"
                  className={!pwd.isValid && pwd.isFocused ? "instructions" : "offscreen"}
                  dangerouslySetInnerHTML={{ __html: fieldsToErrorMessages.pwd}}
                >
                </p>
                <div>
                    <label htmlFor="match-pwd">
                        Confirm Password
                        <span className={matchPwd.isValid && matchPwd.value.length > 0 ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={matchPwd.isValid || matchPwd.value.length === 0 ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        type="password"
                        id="match-pwd"
                        name="match-pwd"
                        value={matchPwd.value}
                        required
                        onChange={(e) => setMatchPwd((prev) => ({...prev, value: e.target.value}))}
                        aria-invalid={matchPwd.isValid ? "false" : "true"}
                        aria-describedby="matchpwdidnote"
                        onFocus={() => setMatchPwd((prev) => ({...prev, isFocused: true}))}
                        onBlur={() => setMatchPwd((prev) => ({...prev, isFocused: false}))}
                    />
                </div>
                <p
                  id="matchpwdidnote"
                  className={!matchPwd.isFocused || matchPwd.isValid && matchPwd.value.length > 0 ? "offscreen" : "instructions"}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    {fieldsToErrorMessages['match-pwd']}
                </p>

                <button
                  className={!user.isValid || !pwd.isValid || !matchPwd.isValid ? '' : 'btn'}
                  disabled={!user.isValid || !pwd.isValid || !matchPwd.isValid}
                  type="submit">
                    Sign
                </button>
            </form>
            <p>Already registered?</p>
            <p className="link-wrap"><a href="#">Sign In</a></p>
            </section>
    );
};

export default Register;















// Dave Gray's solution:
/*
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from './api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>


                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                           
                            <a href="#">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}
*/
// export default Register
