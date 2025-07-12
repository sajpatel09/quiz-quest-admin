import {Fragment, useMemo, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import Swal from 'sweetalert2';
import {createQuiz, deleteQuiz, fetchQuiz, updateQuiz} from "../actions/quiz";
import {useQuery} from "@tanstack/react-query";
import {formatDateTime} from "../lib/date";
import Select from "react-select";
import {fetchCategories} from "../actions/category";
import Pagination from "../components/Pagination";

const Quiz = () => {

    const [state, setState] = useState<any>({
        page: 1,
        limit: 10,
    });
    const [search, setSearch] = useState<any>('');
    const [category, setCategory] = useState<any>('');
    const [addQuizModal, setAddQuizModal] = useState<any>(false);
    const [params, setParams] = useState<any>({
        id: null,
        title: '',
        category: '',
        entryFee: 0,
        prize: 0,
    });

    const {isPending, data, refetch} = useQuery({
        queryKey: ['quiz-list', `search-${search}`, `category-${category}`, `page-${state.page}`, `limit-${state.limit}`],
        queryFn: () => fetchQuiz({search, category, page: state.page, limit: state.limit}),
    })

    const {data: categories} = useQuery({
        queryKey: ['category-list'],
        queryFn: () => fetchCategories({search})?.then((res) => res.categories),
    });

    const categoryOptions = useMemo(() => (categories || []).map((c: any) => ({
        value: c?._id,
        label: c?.name
    })), [categories])

    const categoryOptionsByValue = useMemo(() => categoryOptions.reduce((acc: any, curr: any) => ({
        ...acc,
        [curr.value]: curr
    }), {}), [categoryOptions])

    const changeValue = (e: any) => {
        const {value, id} = e.target;
        setParams({...params, [id]: value});
    };

    const saveQuiz = async () => {
        try {
            if (!params.title) {
                showMessage('Quiz Title is required.', 'error');
                return true;
            }
            if (!params.category) {
                showMessage('Quiz Category is required.', 'error');
                return true;
            }
            if (!params.entryFee) {
                showMessage('Entry Fee is required.', 'error');
                return true;
            }
            if (!params.prize) {
                showMessage('Prize is required.', 'error');
                return true;
            }


            if (params.id) {
                await updateQuiz(data)
            } else {
                await createQuiz(data)
            }

            showMessage('Quiz has been saved successfully.');
        } catch (error) {
            showMessage('Something went wrong.', 'error');
        } finally {
            await refetch()
        }
        setAddQuizModal(false);
    };

    const editQuiz = (quiz: any = null) => {
        setParams({
            id: quiz?._id,
            title: quiz?.title,
            category: quiz?.category?._id,
            entryFee: quiz?.entryFee,
            prize: quiz?.prize
        });
        setAddQuizModal(true);
    };

    const deleteQuizHandler = async (id: string) => {
        try {
            await deleteQuiz(id)
            showMessage('Quiz has been deleted successfully.');
        } catch (error) {
            showMessage('Something went wrong.', 'error');
        } finally {
            await refetch();
        }
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: {container: 'toast'},
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Quiz</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="relative">
                        <input type="text" placeholder="Search Quiz"
                               className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search}
                               onChange={(e) => {
                                   setSearch(e.target.value)
                                   setState({...state, page: 1})
                               }}/>
                        <button type="button"
                                className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5"
                                        opacity="0.5"></circle>
                                <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round"></path>
                            </svg>
                        </button>
                    </div>
                    <Select
                        className={"min-w-[210px]"}
                        placeholder="Filter by Category"
                        options={[{value: "", label: "Select All Category"}].concat(categoryOptions)}
                        id={'category'}
                        value={categoryOptionsByValue[category] || ''}
                        onChange={(e) => {
                            setState({...state, page: 1})
                            setCategory(e?.value)
                        }}
                    />
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editQuiz()}>
                                <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24"
                                     fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                                    <path
                                        opacity="0.5"
                                        d="M18 17.5C18 19.9853 18 22 10 22C2 22 2 19.9853 2 17.5C2 15.0147 5.58172 13 10 13C14.4183 13 18 15.0147 18 17.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12" stroke="currentColor"
                                          strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Add Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                        <tr>
                            <th>Index</th>
                            <th className={"w-1/2"}>Name</th>
                            <th>Category</th>
                            <th className={"whitespace-nowrap"}>Entry Fee</th>
                            <th>Prize</th>
                            <th className={"whitespace-nowrap"}>Created At</th>
                            <th className="!text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            isPending ?
                                <tr className="!text-center">
                                    <td colSpan={4} className={"!py-28 !text-center"}>
                                        <span
                                            className="animate-spin border-4 border-transparent border-l-primary rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>
                                    </td>
                                </tr> :
                                data?.quizzes?.length ?
                                    data?.quizzes.map((quiz: any, index: number) => {
                                        return (
                                            <tr key={quiz._id}>
                                                <td>{
                                                    index + 1
                                                }
                                                </td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div>{quiz.title}</div>
                                                    </div>
                                                </td>
                                                <td className={"whitespace-nowrap"}>{quiz?.category?.name}</td>
                                                <td className={"whitespace-nowrap"}>{quiz.entryFee}</td>
                                                <td className={"whitespace-nowrap"}>{quiz.prize}</td>
                                                <td className={"whitespace-nowrap"}>{quiz.createdAt ? formatDateTime(quiz.createdAt) : <></>}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <button type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => editQuiz(quiz)}>
                                                            Edit
                                                        </button>
                                                        <button type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteQuizHandler(quiz?._id)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })

                                    : <tr className="!text-center">
                                        <td colSpan={4} className={"!py-28 !text-center"}>
                                            No Data Found
                                        </td>
                                    </tr>

                        }
                        </tbody>
                    </table>
                </div>
            </div>
            {data?.total ?
                <Pagination currentPage={state.page} onPageChange={(page) => setState({...state, page})}
                            recordsPerPage={state.limit} totalRecords={data?.total || 0}/>
                : <></>}

            <Transition appear show={addQuizModal} as={Fragment}>
                <Dialog as="div" open={addQuizModal} onClose={() => setAddQuizModal(false)}
                        className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0"
                                      enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100"
                                      leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60"/>
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="panel border-0 p-0 rounded-lg w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddQuizModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div
                                        className="text-lg rounded-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params.id ? 'Edit Quiz' : 'Add Quiz'}
                                    </div>
                                    <div className="p-5">
                                        <div>
                                            <div className="mb-5">
                                                <label htmlFor="title">Title</label>
                                                <input id="title" type="text" placeholder="Quiz Title"
                                                       className="form-input" value={params.title}
                                                       onChange={(e) => changeValue(e)}/>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="title">Category</label>
                                                <Select
                                                    placeholder="Select a Quiz Category"
                                                    options={categoryOptions}
                                                    value={categoryOptionsByValue[params.category] || ''}
                                                    id={'category'}
                                                    onChange={(e) => changeValue({
                                                        target: {
                                                            id: 'category',
                                                            value: e?.value
                                                        }
                                                    })}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="entryFee">Entry Fee</label>
                                                <input id="entryFee" type="number" placeholder="Entry Fee"
                                                       className="form-input" value={params.entryFee}
                                                       onChange={(e) => changeValue(e)}/>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="prize">Prize</label>
                                                <input id="prize" type="number" placeholder="Prize"
                                                       className="form-input" value={params.prize}
                                                       onChange={(e) => changeValue(e)}/>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger"
                                                        onClick={() => setAddQuizModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                        onClick={saveQuiz}>
                                                    {params.id ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Quiz;
