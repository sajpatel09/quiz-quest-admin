import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useLocation} from 'react-router-dom';
import {IRootState} from '../../store';
import {toggleRTL, toggleSidebar, toggleTheme} from '../../store/themeConfigSlice';
import Dropdown from '../Dropdown';

const Header = () => {
    const location = useLocation();
    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    function createMarkup(messages: any) {
        return {__html: messages};
    }

    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((user) => user.id !== value));
    };

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };

    const [search, setSearch] = useState(false);

    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    return (
        <header className={themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}>
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo.svg" alt="logo"/>
                            <span
                                className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300">Quiz Quest</span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                            onClick={() => {
                                dispatch(toggleSidebar());
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round"/>
                                <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div
                        className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                            <form
                                className={`${search && '!block'} sm:relative absolute inset-x-0 sm:top-0 top-1/2 sm:translate-y-0 -translate-y-1/2 sm:mx-0 mx-4 z-10 sm:block hidden`}
                                onSubmit={() => setSearch(false)}
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="form-input ltr:pl-9 rtl:pr-9 ltr:sm:pr-4 rtl:sm:pl-4 ltr:pr-9 rtl:pl-9 peer sm:bg-transparent bg-gray-100 placeholder:tracking-widest"
                                        placeholder="Search..."
                                    />
                                    <button type="button"
                                            className="absolute w-9 h-9 inset-0 ltr:right-auto rtl:left-auto appearance-none peer-focus:text-primary">
                                        <svg className="mx-auto" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5"
                                                    opacity="0.5"/>
                                            <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5"
                                                  strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                    <button type="button"
                                            className="hover:opacity-80 sm:hidden block absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2"
                                            onClick={() => setSearch(false)}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="1.5"/>
                                            <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor"
                                                  strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                            <button
                                type="button"
                                onClick={() => setSearch(!search)}
                                className="search_btn sm:hidden p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                            >
                                <svg className="w-4.5 h-4.5 mx-auto dark:text-[#d0d2d6]" width="20" height="20"
                                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5"
                                            opacity="0.5"/>
                                    <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5"
                                          strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                        <div>
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className={`${
                                        themeConfig.theme === 'light' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('dark'));
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                        <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                        <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                        <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'dark' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('system'));
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'system' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('light'));
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H15C17.8284 3 19.2426 3 20.1213 3.87868C21 4.75736 21 6.17157 21 9V14C21 15.8856 21 16.8284 20.4142 17.4142C19.8284 18 18.8856 18 17 18H7C5.11438 18 4.17157 18 3.58579 17.4142C3 16.8284 3 15.8856 3 14V9Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path opacity="0.5" d="M22 21H2" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path opacity="0.5" d="M15 15H9" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="dropdown shrink-0 flex">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={<img
                                    className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                    src="/assets/images/user-profile.jpeg" alt="userProfile"/>}
                            >
                                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            <img className="rounded-md w-10 h-10 object-cover"
                                                 src="/assets/images/user-profile.jpeg" alt="userProfile"/>
                                            <div className="ltr:pl-4 rtl:pr-4 truncate">
                                                <h4 className="text-base">
                                                    John Doe
                                                    <span
                                                        className="text-xs bg-success-light rounded text-success px-1 ltr:ml-2 rtl:ml-2">Pro</span>
                                                </h4>
                                                <button type="button"
                                                        className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                    johndoe@gmail.com
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/users/profile" className="dark:hover:text-white">
                                            <svg className="ltr:mr-2 rtl:ml-2 shrink-0" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                                                <path
                                                    opacity="0.5"
                                                    d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                            Profile
                                        </Link>
                                    </li>
                                    <li className="border-t border-white-light dark:border-white-light/10">
                                        <Link to="/auth/boxed-signin" className="text-danger !py-3">
                                            <svg className="ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    opacity="0.5"
                                                    d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                                <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="currentColor"
                                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Sign Out
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* horizontal menu */}
                <ul className="horizontal-menu hidden py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse bg-white border-t border-[#ebedf2] dark:border-[#191e3a] dark:bg-black text-black dark:text-white-dark">
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                                    <path
                                        opacity="0.5"
                                        d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span className="px-1">Dashboard</span>
                            </div>
                            <div className="right_arrow">
                                <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </button>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;

