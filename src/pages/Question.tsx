import {Fragment, useMemo, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import Swal from 'sweetalert2';
import {createQuestion, deleteQuestion, fetchQuestion, updateQuestion} from "../actions/question";
import {useQuery} from "@tanstack/react-query";
import {formatDateTime} from "../lib/date";
import Select from "react-select";
import {fetchCategories} from "../actions/category";
import {fetchQuiz} from "../actions/quiz";
import Pagination from "../components/Pagination";

const Question = () => {

    const [state, setState] = useState<any>({
        page: 1,
        limit: 10,
    });
    const [search, setSearch] = useState<any>('');
    const [category, setCategory] = useState<any>('');
    const [quiz, setQuiz] = useState<any>('');
    const [addQuestionModal, setAddQuestionModal] = useState<any>(false);
    const [params, setParams] = useState<any>({
        id: null,
        question: '',
        quiz: '',
        options: Array(4).fill({"text": '', "isCorrect": false}),
    });

    const {isPending, data, refetch} = useQuery({
        queryKey: ['question-list', `search-${search}`, `quiz-${quiz}`, `page-${state.page}`, `limit-${state.limit}`],
        queryFn: () => fetchQuestion({search, quiz, page: state.page, limit: state.limit}),
    })

    const {data: categories} = useQuery({
        queryKey: ['category-list'],
        queryFn: () => fetchCategories({search})?.then((res: any) => res.categories),
    });

    const {data: quizList} = useQuery({
        queryKey: ['quiz-list', `category-${category}`],
        queryFn: () => fetchQuiz({search: '', category}).then((res: any) => res.quizzes),
    });

    // const categoryOptions = useMemo(() => (categories || []).map((c: any) => ({
    //     value: c?._id,
    //     label: c?.name
    // })), [categories])

    // const categoryOptionsByValue = useMemo(() => categoryOptions.reduce((acc: any, curr: any) => ({
    //     ...acc,
    //     [curr.value]: curr
    // }), {}), [categoryOptions])

    const quizOptions = useMemo(() => (quizList || []).map((c: any) => ({
        value: c?._id,
        label: c?.title
    })), [quizList])

    const quizOptionsByValue = useMemo(() => quizOptions.reduce((acc: any, curr: any) => ({
        ...acc,
        [curr.value]: curr
    }), {}), [quizOptions])

    const changeValue = (e: any) => {
        const {value, id} = e.target;
        setParams({...params, [id]: value});
    };

    const saveQuestion = async () => {
        try {
            if (!params.question) {
                showMessage('Question is required.', 'error');
                return true;
            }
            if (!params.quiz) {
                showMessage('Quiz is required.', 'error');
                return true;
            }

            if (params.options?.length !== 4 || params.options.some((opt: any) => !opt.text) || params.options.filter((opt: any) => opt.isCorrect).length !== 1) {
                showMessage('Please provide exactly 4 options with one correct answer.', 'error');
                return true;
            }

            if (params.id) {
                await updateQuestion({
                    id: params.id,
                    question: params.question,
                    quiz: params.quiz,
                    options: params.options
                })
            } else {
                await createQuestion({
                    question: params.question,
                    quiz: params.quiz,
                    options: params.options
                })
            }

            showMessage('Question has been saved successfully.');
        } catch (error) {
            showMessage('Something went wrong.', 'error');
        } finally {
            await refetch()
        }
        setAddQuestionModal(false);
    };

    const editQuestion = (question: any = null) => {
        setParams({
            id: question?._id,
            question: question?.question,
            quiz: question?.quiz?._id,
            options: question?.options || Array(4).fill({"text": '', "isCorrect": false}),
        });
        setAddQuestionModal(true);
    };

    const deleteQuestionHandler = async (id: string) => {
        try {
            await deleteQuestion(id)
            showMessage('Question has been deleted successfully.');
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
                <h2 className="text-xl">Question</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="relative">
                        <input type="text" placeholder="Search Question"
                               className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search}
                               onChange={(e) => setSearch(e.target.value)}/>
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
                    {/*<Select*/}
                    {/*    className={"min-w-[210px]"}*/}
                    {/*    placeholder="Filter by Category"*/}
                    {/*    options={[{value: "", label: "Select All Category"}].concat(categoryOptions)}*/}
                    {/*    id={'category'}*/}
                    {/*    value={categoryOptionsByValue[category] || ''}*/}
                    {/*    onChange={(e) => {*/}
                    {/*        setCategory(e?.value)*/}
                    {/*        setQuiz("");*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Select
                        className={"min-w-[210px]"}
                        placeholder="Filter by Quiz"
                        options={[{value: "", label: "Select All Quiz"}].concat(quizOptions)}
                        id={'category'}
                        value={quizOptionsByValue[quiz] || ''}
                        onChange={(e) => {
                            setQuiz(e?.value)
                        }}
                    />
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editQuestion()}>
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
                                Add Question
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
                            <th>Quiz</th>
                            <th>Created At</th>
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
                                data?.questions?.length ?
                                    data.questions.map((question: any, index: number) => {
                                        return (
                                            <tr key={question._id}>
                                                <td>{
                                                    index + 1
                                                }
                                                </td>
                                                <td>
                                                    <div className="flex items-center max-w-lg">
                                                        <div>{question.question}</div>
                                                    </div>
                                                </td>
                                                <td className={"whitespace-nowrap"}>{question?.quiz?.title}</td>
                                                <td className={"whitespace-nowrap"}>{question.createdAt ? formatDateTime(question.createdAt) : <></>}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <button type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => editQuestion(question)}>
                                                            Edit
                                                        </button>
                                                        <button type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteQuestionHandler(question?._id)}>
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

            <Transition appear show={addQuestionModal} as={Fragment}>
                <Dialog as="div" open={addQuestionModal} onClose={() => setAddQuestionModal(false)}
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
                                        onClick={() => setAddQuestionModal(false)}
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
                                        {params.id ? 'Edit Question' : 'Add Question'}
                                    </div>
                                    <div className="p-5">
                                        <div>
                                            <div className="mb-5">
                                                <label htmlFor="quiz">Quiz</label>
                                                <Select
                                                    placeholder="Select a Quiz"
                                                    options={quizOptions}
                                                    value={quizOptionsByValue[params.quiz] || ''}
                                                    id={'quiz'}
                                                    onChange={(e) => changeValue({
                                                        target: {
                                                            id: 'quiz',
                                                            value: e?.value
                                                        }
                                                    })}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="question">Question</label>
                                                <input id="question" type="text" placeholder="Question"
                                                       className="form-input" value={params.question}
                                                       onChange={(e) => changeValue(e)}/>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="options">Options</label>
                                                <div>
                                                    {(params?.options || []).map((option: any, index: number) => (
                                                        <div key={index} className="flex items-center mb-2 gap-3">
                                                            <input type="text" placeholder={`Option ${index + 1}`}
                                                                   className="form-input w-full"
                                                                   value={option.text}
                                                                   onChange={(e) => {
                                                                       setParams((prevParams: any) => ({
                                                                           ...prevParams,
                                                                           options: prevParams.options.map((opt: any, idx: any) => idx === index ? ({
                                                                               ...opt,
                                                                               text: e.target.value
                                                                           }) : opt)
                                                                       }))
                                                                   }}/>
                                                            <label className="w-12 h-6 relative">
                                                                <input type="checkbox"
                                                                       className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                       checked={option.isCorrect}
                                                                       onChange={(e) => {
                                                                           setParams((prevParams: any) => ({
                                                                               ...prevParams,
                                                                               options: prevParams.options.map((opt: any, idx: any) => idx === index ? ({
                                                                                   ...opt,
                                                                                   isCorrect: e.target.checked
                                                                               }) : ({
                                                                                   ...opt, isCorrect: false
                                                                               }))
                                                                           }))
                                                                       }}
                                                                       id="custom_switch_checkbox1"/>
                                                                <span
                                                                    className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-6 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger"
                                                        onClick={() => setAddQuestionModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                        onClick={saveQuestion}>
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

export default Question;
